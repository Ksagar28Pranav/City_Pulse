"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../api/page";

export default function SignUpForm() {
  const [form, setForm] = useState({ username: "", password: "", role: "citizen" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      router.push("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm mb-1 opacity-80">Username</label>
            <input
              id="username"
              name="username"
              placeholder="john_doe"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1 opacity-80">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm mb-1 opacity-80">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 outline-none focus:border-white/30"
            >
              <option value="citizen">Citizen</option>
              <option value="officer">Officer</option>
            </select>
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 font-medium">Sign up</button>
        </form>
        {msg ? <p className="mt-4 text-sm text-red-400 text-center">{msg}</p> : null}
      </div>
    </div>
  );
}


