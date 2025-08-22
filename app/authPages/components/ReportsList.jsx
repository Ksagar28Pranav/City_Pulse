import { useEffect, useState } from "react";
import { getMyReports, getAllReports } from "../api/page";

export default function ReportsList({ token, role }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = role === "citizen" ? await getMyReports(token) : await getAllReports(token);
        setReports(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReports();
  }, [token, role]);

  return (
    <div>
      <h2>{role === "citizen" ? "My Reports" : "All Reports"}</h2>
      {reports.length === 0 ? (
        <p>No reports</p>
      ) : (
        <ul>
          {reports.map((r) => (
            <li key={r._id}>
              <strong>{r.type}</strong>: {r.description}
              {role === "officer" && ` (Citizen: ${r.citizenId.username})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
