"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api/page";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      router.push("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
