import { useEffect, useMemo, useState } from "react";
import { getMyReports, getAllReports, getOverdueReports, updateReportStatus } from "../api/page";

export default function ReportsList({ token, role }) {
  const [reports, setReports] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (role === "citizen") {
          const res = await getMyReports(token);
          setReports(res.data);
        } else {
          const [allRes, overdueRes] = await Promise.all([
            getAllReports(token),
            getOverdueReports(token),
          ]);
          setReports(allRes.data);
          setOverdue(overdueRes.data.map((r) => r._id));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchReports();
  }, [token, role]);

  useEffect(() => {
    if (role !== 'officer') return;
    const id = setInterval(async () => {
      try {
        const [allRes, overdueRes] = await Promise.all([
          getAllReports(token),
          getOverdueReports(token),
        ]);
        setReports(allRes.data);
        setOverdue(overdueRes.data.map((r) => r._id));
      } catch {}
    }, 60000);
    return () => clearInterval(id);
  }, [role, token]);

  const grouped = useMemo(() => {
    if (role !== "officer") return {};
    const base = onlyOverdue ? reports.filter(r => overdue.includes(r._id)) : reports;
    return {
      not_done: base.filter(r => r.status === 'not_done'),
      in_progress: base.filter(r => r.status === 'in_progress'),
      finished: base.filter(r => r.status === 'finished'),
    };
  }, [reports, role, onlyOverdue, overdue]);

  const handleChangeStatus = async (id, status) => {
    try {
      const res = await updateReportStatus(id, status, token);
      setReports(prev => prev.map(r => r._id === id ? res.data : r));
    } catch (e) {
      console.log(e);
    }
  };

  if (role !== "officer") {
    return (
      <div>
        <h2>My Reports</h2>
        {reports.length === 0 ? (
          <p>No reports</p>
        ) : (
          <ul>
            {reports.map((r) => (
              <li key={r._id}>
                <strong>{r.type}</strong>: {r.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <h2 className="text-xl font-semibold">Officer Dashboard</h2>
        {overdue.length > 0 && (
          <span className="text-red-400 font-semibold">
            {overdue.length} report(s) overdue (48h+)
          </span>
        )}
        <label className="ml-auto flex items-center gap-2 text-sm opacity-80">
          <input type="checkbox" checked={onlyOverdue} onChange={(e) => setOnlyOverdue(e.target.checked)} />
          Show overdue only
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['not_done','in_progress','finished'].map((column) => (
          <div key={column} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3">
            <h3 className="capitalize font-medium mb-2">{column.replace('_',' ')}</h3>
            <ul className="space-y-3">
              {(grouped[column] || []).map((r) => (
                <li key={r._id} className="rounded-lg border border-white/10 p-3">
                  <div className="font-semibold">
                    {r.type} {overdue.includes(r._id) ? <span className="text-red-400">• overdue</span> : null}
                  </div>
                  <div className="opacity-80">{r.description}</div>
                  <div className="text-xs opacity-70">Citizen: {r.citizenId?.username}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {column !== 'not_done' && (
                      <button className="px-2 py-1 text-xs rounded-md border border-white/10 hover:bg-white/10" onClick={() => handleChangeStatus(r._id, 'not_done')}>Not done</button>
                    )}
                    {column !== 'in_progress' && (
                      <button className="px-2 py-1 text-xs rounded-md border border-white/10 hover:bg-white/10" onClick={() => handleChangeStatus(r._id, 'in_progress')}>In progress</button>
                    )}
                    {column !== 'finished' && (
                      <button className="px-2 py-1 text-xs rounded-md bg-green-600 hover:bg-green-700" onClick={() => handleChangeStatus(r._id, 'finished')}>Finished</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
