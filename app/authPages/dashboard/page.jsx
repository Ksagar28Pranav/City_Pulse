"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateReport from "../components/CreateReport";
import ReportsList from "../components/ReportsList";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");q
    const r = localStorage.getItem("role");
    if (!t) router.push("/"); 
    setToken(t);
    setRole(r);
  }, [router]);

  if (!token) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard ({role})</h1>
      {role === "citizen" && <CreateReport token={token} />}
      <ReportsList token={token} role={role} />
    </div>
  );
}
