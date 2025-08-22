import { useState, useEffect } from "react";
import { createReport } from "../api/page";
import GoogleMap from "./GoogleMap";

export default function CreateReport({ token, onReportCreated }) {
  const [form, setForm] = useState({ type: "", description: "", lat: "", lng: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationSelect = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      lat: lat ? lat.toString() : "",
      lng: lng ? lng.toString() : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.description) {
      setMsg("❌ Type and description are required");
      return;
    }
    
    setSubmitting(true);
    setMsg(""); // Clear previous messages
    
    try {
      const payload = {
        type: form.type,
        description: form.description,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      };
      
      console.log('Submitting report with payload:', payload);
      const res = await createReport(payload, token);
      console.log('Report created successfully:', res.data);
      
      setMsg("✅ Report created successfully! ID: " + res.data._id);
      setForm({ type: "", description: "", lat: "", lng: "" });
      setShowMap(false);
      
      // Notify parent component to refresh reports
      if (onReportCreated) {
        onReportCreated(res.data);
      }
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMsg("");
      }, 5000);
      
    } catch (err) {
      console.error('Error creating report:', err);
      setMsg("❌ " + (err.response?.data?.msg || "Error creating report. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const issueTypes = [
    "Pothole",
    "Streetlight",
    "Garbage Collection",
    "Traffic Signal",
    "Sidewalk Damage",
    "Water Leak",
    "Sewer Issue",
    "Tree Maintenance",
    "Street Sign",
    "Other"
  ];

  return (
    <div className={`card-dark p-8 space-y-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Create New Report</h2>
          <p className="text-gray-400">Help improve your community by reporting issues</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Issue Type *
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input-dark w-full"
              required
            >
              <option value="">Select issue type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={handleChange}
              className="input-dark w-full h-24 resize-none"
              required
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Location Details</h3>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="btn btn-outline text-sm px-4 py-2 border-gray-600 hover:bg-gray-600"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {showMap && (
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <GoogleMap
                onLocationSelect={handleLocationSelect}
                initialLat={form.lat ? parseFloat(form.lat) : null}
                initialLng={form.lng ? parseFloat(form.lng) : null}
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                placeholder="18.5204"
                value={form.lat}
                onChange={handleChange}
                className="input-dark"
              />
              <p className="text-xs text-gray-500 mt-1">GPS coordinates for precise location</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                name="lng"
                type="number"
                step="any"
                placeholder="73.8567"
                value={form.lng}
                onChange={handleChange}
                className="input-dark"
              />
              <p className="text-xs text-gray-500 mt-1">GPS coordinates for precise location</p>
            </div>
          </div>

          {form.lat && form.lng && (
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">
                  Location set: {parseFloat(form.lat).toFixed(6)}, {parseFloat(form.lng).toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-400">
            * Required fields
          </div>
          <button
            disabled={submitting}
            type="submit"
            className="btn btn-primary px-8 py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed hover-lift"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="spinner w-4 h-4"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Submit Report</span>
              </div>
            )}
          </button>
        </div>
      </form>

      {msg && (
        <div className={`mt-6 p-4 rounded-lg ${
          msg.includes('✅') 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {msg.includes('✅') ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{msg.replace('✅ ', '').replace('❌ ', '')}</span>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tips for Better Reports</span>
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Be specific about the location and issue details</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Use the map to select precise location or enable location permissions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Your report will be reviewed by city officials within 48 hours</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Reports not resolved within 48 hours will trigger warnings for officers</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
