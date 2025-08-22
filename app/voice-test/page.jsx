"use client"
import { useState } from "react";
import VoiceAssistant from "../components/VoiceAssistant";
import MobileVoiceAssistant from "../components/MobileVoiceAssistant";

export default function VoiceTestPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [testReports, setTestReports] = useState([]);

  // Check if mobile on component mount
  if (typeof window !== 'undefined' && !isMobile) {
    setIsMobile(window.innerWidth <= 768);
  }

  const handleTestReport = (report) => {
    setTestReports(prev => [...prev, report]);
    console.log('Test report created:', report);
  };

  const testCommands = [
    "There's a pothole on Trimbak Highway",
    "Streetlight not working on College Road",
    "Garbage collection issue in Panchavati area",
    "Traffic signal broken on Mumbai Nashik Highway"
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

        {/* Instructions */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">📋 Quick Instructions:</h2>
          <ol className="space-y-2 text-sm">
            <li>1. <strong>Allow microphone and location permissions</strong> when prompted</li>
            <li>2. <strong>Click the green microphone button</strong> to start listening</li>
            <li>3. <strong>Speak clearly</strong> using one of the example commands below</li>
            <li>4. <strong>Listen for confirmation</strong> and check the reports below</li>
          </ol>
        </div>

        {/* Example Commands */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">💬 Try These Commands:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {testCommands.map((command, index) => (
              <div key={index} className="bg-gray-700/50 rounded p-3 border border-gray-600">
                <p className="text-sm text-gray-300 mb-1">Command {index + 1}:</p>
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
                <div key={index} className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-green-400">
                        {report.type} - {report.location || 'Current Location'}
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

        {/* Troubleshooting */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">🔧 Troubleshooting:</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>No microphone access?</strong> Check browser permissions</li>
            <li>• <strong>Not working on mobile?</strong> Try the floating button</li>
            <li>• <strong>Speech not recognized?</strong> Speak clearly and slowly</li>
            <li>• <strong>Location issues?</strong> Enable GPS and location services</li>
          </ul>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <a 
            href="/authPages/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
