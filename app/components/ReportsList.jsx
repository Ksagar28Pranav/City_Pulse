import { useEffect, useMemo, useState } from "react";
import { getMyReports, getAllReports, getOverdueReports, getWarningReports, updateReportStatus } from "../api/page";

export default function ReportsList({ token, role }) {
  const [reports, setReports] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      if (role === "citizen") {
        const res = await getMyReports(token);
        console.log('Citizen reports fetched:', res.data);
        setReports(res.data);
      } else {
        const [allRes, overdueRes, warningsRes] = await Promise.all([
          getAllReports(token),
          getOverdueReports(token),
          getWarningReports(token),
        ]);
        console.log('Officer reports fetched:', allRes.data);
        console.log('Overdue reports:', overdueRes.data);
        console.log('Warning reports:', warningsRes.data);
        setReports(allRes.data);
        setOverdue(overdueRes.data.map((r) => r._id));
        setWarnings(warningsRes.data.map((r) => r._id));
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token, role]);

  useEffect(() => {
    if (role !== 'officer') return;
    const id = setInterval(async () => {
      try {
        const [allRes, overdueRes, warningsRes] = await Promise.all([
          getAllReports(token),
          getOverdueReports(token),
          getWarningReports(token),
        ]);
        setReports(allRes.data);
        setOverdue(overdueRes.data.map((r) => r._id));
        setWarnings(warningsRes.data.map((r) => r._id));
      } catch (err) {
        console.error('Error in auto-refresh:', err);
      }
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
      console.log('Status updated:', res.data);
      setReports(prev => prev.map(r => r._id === id ? res.data : r));
    } catch (e) {
      console.error('Error updating status:', e);
      alert('Failed to update status. Please try again.');
    }
  };

  const formatTimeRemaining = (hoursUntilOverdue) => {
    if (hoursUntilOverdue <= 0) {
      return "Overdue";
    }
    const days = Math.floor(hoursUntilOverdue / 24);
    const hours = Math.floor(hoursUntilOverdue % 24);
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }
    return `${hours}h remaining`;
  };

  const getTimeStatusColor = (hoursUntilOverdue, status) => {
    if (status === 'finished') return 'text-green-400';
    if (hoursUntilOverdue <= 0) return 'text-red-400';
    if (hoursUntilOverdue <= 12) return 'text-yellow-400';
    return 'text-gray-400';
  };

  // Citizen View
  if (role !== "officer") {
    return (
      <div className="card-dark p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">My Reports</h2>
              <p className="text-gray-400">Track the status of your submitted reports</p>
            </div>
          </div>
          <button
            onClick={fetchReports}
            className="btn btn-outline text-sm px-3 py-1 border-gray-600 hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-gray-400">Start by creating your first report above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div 
                key={report._id} 
                className="p-6 rounded-lg border border-gray-700 bg-gray-800/50 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{report.type}</h3>
                      <span className={`status-badge ${
                        report.status === 'not_done' ? 'status-not-done' :
                        report.status === 'in_progress' ? 'status-in-progress' :
                        'status-finished'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      {warnings.includes(report._id) && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          ⚠️ {report.warnings} Warning{report.warnings > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3">{report.description}</p>
                    
                    {/* Timer Information */}
                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <div className={`flex items-center space-x-1 ${getTimeStatusColor(report.hoursUntilOverdue, report.status)}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimeRemaining(report.hoursUntilOverdue)}</span>
                      </div>
                      <span className="text-gray-400">ID: {report._id}</span>
                      {report.lat && report.lng && (
                        <span className="text-gray-400">📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {report.status !== 'finished' && (
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            report.hoursUntilOverdue <= 0 ? 'bg-red-500' :
                            report.hoursUntilOverdue <= 12 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, Math.max(0, (report.hoursUntilOverdue / 48) * 100))}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Officer View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Officer Dashboard</h2>
              <p className="text-gray-400">Manage and resolve citizen reports</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {overdue.length > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold">
                  {overdue.length} overdue
                </span>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 font-semibold">
                  {warnings.length} warnings
                </span>
              </div>
            )}
            <button
              onClick={fetchReports}
              className="btn btn-outline text-sm px-3 py-1 border-gray-600 hover:bg-gray-600"
            >
              Refresh
            </button>
            <label className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                checked={onlyOverdue} 
                onChange={(e) => setOnlyOverdue(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-300">Show overdue only</span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reports...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { key: 'not_done', title: 'Not Done', color: 'red', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { key: 'in_progress', title: 'In Progress', color: 'yellow', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { key: 'finished', title: 'Finished', color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((column) => (
            <div key={column.key} className="card-dark p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 bg-gradient-to-br from-${column.color}-500 to-${column.color}-600 rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={column.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold capitalize">{column.title}</h3>
                  <p className="text-sm text-gray-400">
                    {(grouped[column.key] || []).length} reports
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(grouped[column.key] || []).map((report) => (
                  <div 
                    key={report._id} 
                    className={`p-4 rounded-lg border ${
                      overdue.includes(report._id) 
                        ? 'border-red-500/30 bg-red-500/10' 
                        : warnings.includes(report._id)
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-800/50'
                    } hover-lift`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm">{report.type}</h4>
                        <div className="flex items-center space-x-1">
                          {overdue.includes(report._id) && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                              Overdue
                            </span>
                          )}
                          {warnings.includes(report._id) && (
                            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                              ⚠️ {report.warnings}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{report.description}</p>
                      
                      {/* Timer Information */}
                      <div className={`text-xs ${getTimeStatusColor(report.hoursUntilOverdue, report.status)}`}>
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTimeRemaining(report.hoursUntilOverdue)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Citizen: {report.citizenId?.username || 'Unknown'}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {column.key !== 'not_done' && (
                          <button 
                            className="btn btn-outline text-xs px-3 py-1 border-gray-600 hover:bg-gray-600"
                            onClick={() => handleChangeStatus(report._id, 'not_done')}
                          >
                            Not Done
                          </button>
                        )}
                        {column.key !== 'in_progress' && (
                          <button 
                            className="btn btn-outline text-xs px-3 py-1 border-gray-600 hover:bg-gray-600"
                            onClick={() => handleChangeStatus(report._id, 'in_progress')}
                          >
                            In Progress
                          </button>
                        )}
                        {column.key !== 'finished' && (
                          <button 
                            className="btn btn-success text-xs px-3 py-1"
                            onClick={() => handleChangeStatus(report._id, 'finished')}
                          >
                            Finished
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
