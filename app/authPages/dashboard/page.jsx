"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateReport from "../../components/CreateReport";
import ReportsList from "../../components/ReportsList";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (!t) router.push("/"); 
    setToken(t);
    setRole(r);
    setIsVisible(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  const handleReportCreated = (newReport) => {
    console.log('New report created:', newReport);
    // Trigger refresh of reports list
    setRefreshTrigger(prev => prev + 1);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container-responsive py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">City Pulse</h1>
              <p className="text-sm text-gray-400 capitalize">{role} Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connected</span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container-responsive py-8">
        <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Welcome Section */}
          <div className="card-dark p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {role === 'citizen' ? 'Citizen' : 'Officer'}!
                </h2>
                <p className="text-gray-400">
                  {role === 'citizen' 
                    ? 'Report issues and track their progress in real-time.'
                    : 'Manage and resolve citizen reports efficiently.'
                  }
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Report Creation */}
          {role === "citizen" && (
            <div className="animate-slide-in">
              <CreateReport 
                token={token} 
                onReportCreated={handleReportCreated}
              />
            </div>
          )}

          {/* Reports Section */}
          <div className="animate-slide-in">
            <ReportsList 
              token={token} 
              role={role} 
              key={refreshTrigger} // Force re-render when new report is created
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container-responsive py-8 border-t border-gray-800 mt-16">
        <div className="text-center text-gray-400 text-sm">
          © 2024 City Pulse. Empowering communities through technology.
        </div>
      </footer>
    </div>
  );
}
