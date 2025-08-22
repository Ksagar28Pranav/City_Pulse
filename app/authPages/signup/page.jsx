"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../api/page";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "", role: "citizen" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      router.push("/"); // redirect to login
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
