"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDseIOaysmhMDjUeTfLGrcXZxiyfqE5gII",
  authDomain: "citypulse-104be.firebaseapp.com",
  projectId: "citypulse-104be",
  storageBucket: "citypulse-104be.firebasestorage.app",
  messagingSenderId: "456582421837",
  appId: "1:456582421837:web:cb62393d2ff51d3c5deb04",
  measurementId: "G-LPCBDW5543",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

type Attachment = {
  url: string;
  name: string;
  contentType: string;
  size: number;
};

type Report = {
  id: string;
  issue: string;
  description?: string;
  location?: string; // "lat, lng"
  createdAt?: string;
  attachments?: Attachment[];
};

export default function UrbanGrowthTracker() {
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState({ location: "", issue: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const [L, setL] = useState<any>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "prompt" | "granted" | "denied" | "error">("idle");
  const [geoMessage, setGeoMessage] = useState<string>("");

  // Load Leaflet and set default marker icon with explicit size/anchors
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      // @ts-ignore
      leaflet.Marker.prototype.options.icon = DefaultIcon;
      setL(leaflet);
    })();
  }, []);

  // Firestore live updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReports(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsubscribe();
  }, []);

  const setCoordsToForm = (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, location: `${lat}, ${lng}` }));
  };

  const getBrowserLocation = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });

  const requestLocation = useCallback(async () => {
    setGeoMessage("");
    try {
      if (navigator.permissions && (navigator.permissions as any).query) {
        try {
          const perm = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          if (perm.state === "granted") {
            setGeoStatus("granted");
            const pos = await getBrowserLocation();
            setCoordsToForm(pos.coords.latitude, pos.coords.longitude);
            return;
          } else if (perm.state === "prompt") {
            setGeoStatus("prompt");
            const pos = await getBrowserLocation(); // triggers prompt
            setGeoStatus("granted");
            setCoordsToForm(pos.coords.latitude, pos.coords.longitude);
            return;
          } else if (perm.state === "denied") {
            setGeoStatus("denied");
            setGeoMessage("Location permission is blocked. Enable it for this site in your browser settings and try again.");
            return;
          }
        } catch {
          // fall through to direct geolocation call
        }
      }
      // Fallback for browsers without Permissions API
      const pos = await getBrowserLocation();
      setGeoStatus("granted");
      setCoordsToForm(pos.coords.latitude, pos.coords.longitude);
    } catch (err: any) {
      setGeoStatus(err?.code === 1 ? "denied" : "error"); // 1 = PERMISSION_DENIED
      setGeoMessage(err?.message || "Unable to retrieve location. Check permissions or try again.");
    }
  }, []);

  const parseLatLng = (loc?: string): [number, number] | null => {
    if (!loc) return null;
    const [latStr, lngStr] = loc.split(",").map(s => s.trim());
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    // Optional: filter by type/size here
    setFiles(selected);
    setUploadProgress({});
  };

  const uploadAttachments = async (reportId: string): Promise<Attachment[]> => {
    if (files.length === 0) return [];
    const uploaded: Attachment[] = [];

    await Promise.all(
      files.map(async (file) => {
        const path = `reports/${reportId}/${Date.now()}_${file.name}`;
        const ref = storageRef(storage, path);
        const task = uploadBytesResumable(ref, file, { contentType: file.type });

        const url: string = await new Promise((resolve, reject) => {
          task.on(
            "state_changed",
            (snapshot) => {
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress((prev) => ({ ...prev, [file.name]: pct }));
            },
            (err) => reject(err),
            async () => {
              const downloadURL = await getDownloadURL(task.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });

        uploaded.push({
          url,
          name: file.name,
          contentType: file.type,
          size: file.size,
        });
      })
    );

    return uploaded;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.issue) return;
    setSubmitting(true);
    try {
      // 1) Create the report document
      const created = await addDoc(collection(db, "reports"), {
        issue: form.issue,
        description: form.description,
        location: form.location,
        createdAt: new Date().toISOString(),
        attachments: [],
      });

      // 2) Upload any selected files and update the document with attachment URLs
      const attachments = await uploadAttachments(created.id);
      if (attachments.length > 0) {
        await updateDoc(doc(db, "reports", created.id), { attachments });
      }

      // 3) Reset form and files
      setForm({ location: "", issue: "", description: "" });
      setFiles([]);
      setUploadProgress({});
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!L) return <div className="p-10">Loading map...</div>;

  return (
    <div className="flex h-screen">
      {/* Map Section */}
      <div className="w-2/3 h-full">
        <MapContainer center={[19.964377, 73.669671]} zoom={12} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((r) => {
            const pos = parseLatLng(r.location);
            if (!pos) return null;
            return (
              <Marker key={r.id} position={pos}>
                <Popup>
                  <b>{r.issue}</b>
                  <p>{r.description}</p>
                  <small>{r.location}</small>
                  {Array.isArray(r.attachments) && r.attachments.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {r.attachments.map((a, idx) => (
                        <div key={idx}>
                          {a.contentType.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.url} alt={a.name} style={{ maxWidth: 200, maxHeight: 150 }} />
                          ) : a.contentType.startsWith("video/") ? (
                            <video src={a.url} controls style={{ maxWidth: 200, maxHeight: 150 }} />
                          ) : (
                            <a href={a.url} target="_blank" rel="noreferrer">Download {a.name}</a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Form & Feed */}
      <div className="w-1/3 p-4 bg-gray-100 text-black overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Report an Issue</h2>

        {/* Location consent and feedback */}
        <div className="mb-3">
          <button
            type="button"
            onClick={requestLocation}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Use My Location
          </button>
          {geoStatus === "prompt" && (
            <p className="text-sm text-gray-700 mt-2">Please allow location access in the browser prompt.</p>
          )}
          {geoMessage && <p className="text-sm text-red-600 mt-2">{geoMessage}</p>}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Location (auto-filled after permission)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="p-2 border rounded"
            readOnly
          />

          {/* Upload section below Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={onFileSelect}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Previews */}
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {files.map((f) => {
                  const url = URL.createObjectURL(f);
                  const isImage = f.type.startsWith("image/");
                  const progress = uploadProgress[f.name];
                  return (
                    <div key={f.name} className="border rounded p-2 bg-white">
                      <div className="text-xs mb-1 truncate">{f.name}</div>
                      {isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={f.name} className="w-full h-32 object-cover rounded" />
                      ) : (
                        <video src={url} controls className="w-full h-32 object-cover rounded" />
                      )}
                      {typeof progress === "number" && (
                        <div className="mt-1 h-1 bg-gray-200 rounded">
                          <div
                            className="h-1 bg-blue-600 rounded"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Issue Type (e.g. Flood, Traffic)"
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <h2 className="text-xl font-bold mt-6 mb-2">Live Feed</h2>
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="p-2 border rounded bg-white shadow">
              <b>{r.issue}</b> - {r.location}
              <p className="text-sm">{r.description}</p>
              {Array.isArray(r.attachments) && r.attachments.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {r.attachments.map((a, idx) => (
                    <div key={idx} className="border rounded p-2">
                      {a.contentType.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.url} alt={a.name} className="w-full h-28 object-cover rounded" />
                      ) : a.contentType.startsWith("video/") ? (
                        <video src={a.url} controls className="w-full h-28 object-cover rounded" />
                      ) : (
                        <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                          {a.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
