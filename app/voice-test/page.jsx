"use client";
import { useState, useEffect } from "react";
import VoiceAssistant from "../components/VoiceAssistant";
import MobileVoiceAssistant from "../components/MobileVoiceAssistant";

export default function VoiceTestPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [testReports, setTestReports] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);

      // 🎤 Request microphone
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          console.log("🎤 Microphone access granted");
          stream.getTracks().forEach(track => track.stop()); // stop mic immediately
        })
        .catch((err) => {
          console.error("❌ Microphone error:", err);
        });

      // 📍 Request location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("📍 Location access granted:", pos.coords);
          setPermissionsGranted(true);
          setLocationError(null);
        },
        (err) => {
          console.error(`❌ Location error [${err.code}]: ${err.message}`);
          let message = "Unable to get your location.";
          if (err.code === 1) message = "Location permission denied. Please enable it in browser settings.";
          if (err.code === 2) message = "Location unavailable. Please check GPS or internet.";
          if (err.code === 3) message = "Location request timed out. Try again.";
          setLocationError(message);
          setPermissionsGranted(false);
        }
      );
    }
  }, []);

  const handleTestReport = (report) => {
    setTestReports((prev) => [...prev, report]);
    console.log("Test report created:", report);
  };

  const testCommands = [
    "There's a pothole on Trimbak Highway",
    "Streetlight not working on College Road",
    "Garbage collection issue in Panchavati area",
    "Traffic signal broken on Mumbai Nashik Highway",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">🎤 Voice Assistant Test</h1>
          <p className="text-lg text-gray-300">
            Test the voice assistant functionality
          </p>
        </div>

        {/* Location status */}
        {locationError && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm">
            ⚠️ {locationError}
          </div>
        )}

        {/* Example Commands */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">💬 Try These Commands:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {testCommands.map((command, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded p-3 border border-gray-600"
              >
                <p className="text-sm text-gray-300 mb-1">
                  Command {index + 1}:
                </p>
                <p className="text-white font-medium">"{command}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Assistant */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">🎤 Voice Assistant:</h3>
          {isMobile ? (
            <MobileVoiceAssistant
              token="test-token"
              onReportCreated={handleTestReport}
              role="citizen"
            />
          ) : (
            <VoiceAssistant
              token="test-token"
              onReportCreated={handleTestReport}
              role="citizen"
            />
          )}
        </div>

        {/* Test Reports */}
        {testReports.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">✅ Test Reports Created:</h3>
            <div className="space-y-3">
              {testReports.map((report, index) => (
                <div
                  key={index}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-green-400">
                        {report.type} - {report.location || "Current Location"}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        {report.description}
                      </p>
                      {report.voiceCommand && (
                        <p className="text-xs text-gray-400 mt-1">
                          Voice: "{report.voiceCommand}"
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {report._id || `test-${index + 1}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
