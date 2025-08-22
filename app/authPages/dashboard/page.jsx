"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateReport from "../../components/CreateReport";
import ReportsList from "../../components/ReportsList";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (!t) router.push("/"); 
    setToken(t);
    setRole(r);
  }, [router]);

  if (!token) return <p>Loading...</p>;

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard ({role})</h1>
      </div>
      {role === "citizen" && (
        <div className="mb-6">
          <CreateReport token={token} />
        </div>
      )}
      <ReportsList token={token} role={role} />
    </div>
  );
}
