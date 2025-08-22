"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

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

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function UrbanGrowthTracker() {
  const [reports, setReports] = useState<any[]>([]);
  const [form, setForm] = useState({ location: "", issue: "", description: "" });
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");

      const DefaultIcon = leaflet.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      leaflet.Marker.prototype.options.icon = DefaultIcon;

      setL(leaflet);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReports(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setForm((prev) => ({ ...prev, location: `${latitude}, ${longitude}` }));
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.issue) return;
    await addDoc(collection(db, "reports"), form);
    setForm({ location: "", issue: "", description: "" });
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

          {reports.map((r, i) => (
            <Marker
              key={i}
              position={[
                19.964377 + Math.random() * 0.01,
                73.669671 + Math.random() * 0.01,
              ]}
            >
              <Popup>
                <b>{r.issue}</b>
                <p>{r.description}</p>
                <small>{r.location}</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Form & Feed */}
      <div className="w-1/3 p-4 bg-gray-100 text-black overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Report an Issue</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="p-2 border rounded"
            readOnly // ✅ User location auto-filled
          />
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
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Submit
          </button>
        </form>

        <h2 className="text-xl font-bold mt-6 mb-2">Live Feed</h2>
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="p-2 border rounded bg-white shadow">
              <b>{r.issue}</b> - {r.location}
              <p className="text-sm">{r.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
