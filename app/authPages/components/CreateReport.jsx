import { useState } from "react";
import { createReport } from "../api/page";

export default function CreateReport({ token }) {
  const [form, setForm] = useState({ type: "", description: "", lat: "", lng: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createReport(form, token);
      setMsg("Report created with ID: " + res.data._id);
      setForm({ type: "", description: "", lat: "", lng: "" });
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div>
      <h2>Create Report</h2>
      <form onSubmit={handleSubmit}>
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange} />
        <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
