import { useState } from "react";
import { createReport } from "../api/page";

export default function CreateReport({ token }) {
  const [form, setForm] = useState({ type: "", description: "", lat: "", lng: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.description) {
      setMsg("Type and description are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        description: form.description,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      };
      const res = await createReport(payload, token);
      setMsg("Report created with ID: " + res.data._id);
      setForm({ type: "", description: "", lat: "", lng: "" });
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create Report</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm mb-1 opacity-80">Type</label>
          <input name="type" placeholder="Pothole, Streetlight..." value={form.type} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1 opacity-80">Description</label>
          <input name="description" placeholder="Describe the issue" value={form.description} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30" />
        </div>
        <div>
          <label className="block text-sm mb-1 opacity-80">Latitude</label>
          <input name="lat" placeholder="18.5204" value={form.lat} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30" />
        </div>
        <div>
          <label className="block text-sm mb-1 opacity-80">Longitude</label>
          <input name="lng" placeholder="73.8567" value={form.lng} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30" />
        </div>
        <div className="md:col-span-2">
          <button disabled={submitting} type="submit" className="w-full rounded-md bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 font-medium disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit report'}
          </button>
        </div>
      </form>
      {msg ? <p className="mt-3 text-sm text-center opacity-90">{msg}</p> : null}
    </div>
  );
}
