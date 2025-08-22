import { useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import MobileVoiceAssistant from "./MobileVoiceAssistant";

export default function VoiceAssistantDemo() {
  const [demoMode, setDemoMode] = useState(false);
  const [demoToken] = useState("demo-token-123");
  const [demoReports, setDemoReports] = useState([]);

  const handleDemoReportCreated = (report) => {
    setDemoReports(prev => [...prev, report]);
    console.log('Demo report created:', report);
  };

  const testCommands = [
    "There's a pothole on Trimbak Highway",
    "Streetlight not working on College Road",
    "Garbage collection issue in Panchavati area",
    "Traffic signal broken on Mumbai Nashik Highway",
    "Water leak on Gangapur Road",
    "Sewer problem in Old Nashik",
    "Tree branch fallen on Sharanpur Road",
    "Street sign missing on Nashik Road"
  ];

  const runDemo = () => {
    setDemoMode(true);
    // Simulate voice commands
    testCommands.forEach((command, index) => {
      setTimeout(() => {
        console.log(`Demo command ${index + 1}: ${command}`);
        // In a real demo, this would trigger the voice recognition
      }, index * 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">City Pulse Voice Assistant Demo</h1>
          <p className="text-xl text-gray-300">
            Experience the future of civic reporting with voice commands
          </p>
        </div>

        {/* Demo Controls */}
        <div className="card-dark p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Demo Controls</h2>
          <div className="space-y-4">
            <button
              onClick={runDemo}
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Start Voice Assistant Demo
            </button>
            
            <div className="text-sm text-gray-400">
              <p>This demo showcases the voice assistant functionality</p>
              <p>Click the voice button and try speaking the test commands</p>
            </div>
          </div>
        </div>

        {/* Test Commands */}
        <div className="card-dark p-6">
          <h2 className="text-2xl font-bold mb-4">Test Voice Commands</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {testCommands.map((command, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 mb-1">Command {index + 1}:</p>
                <p className="text-white font-medium">"{command}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Assistant Components */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Desktop Version */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Desktop Voice Assistant</h2>
            <VoiceAssistant 
              token={demoToken}
              onReportCreated={handleDemoReportCreated}
              role="citizen"
            />
          </div>

          {/* Mobile Version */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mobile Voice Assistant</h2>
            <MobileVoiceAssistant 
              token={demoToken}
              onReportCreated={handleDemoReportCreated}
              role="citizen"
            />
          </div>
        </div>

        {/* Demo Reports */}
        {demoReports.length > 0 && (
          <div className="card-dark p-6">
            <h2 className="text-2xl font-bold mb-4">Demo Reports Created</h2>
            <div className="space-y-4">
              {demoReports.map((report, index) => (
                <div key={index} className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-green-400">
                        {report.type} - {report.location || 'Current Location'}
                      </h3>
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
                      ID: {report._id || `demo-${index + 1}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="card-dark p-6">
          <h2 className="text-2xl font-bold mb-4">Voice Assistant Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400">Voice Recognition</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Real-time speech recognition</li>
                <li>• Natural language processing</li>
                <li>• Multiple issue type detection</li>
                <li>• Location extraction from voice</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-400">Location Services</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• GPS integration</li>
                <li>• Nashik region support</li>
                <li>• Automatic location detection</li>
                <li>• Fallback to current location</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-400">Mobile Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Responsive design</li>
                <li>• Touch-friendly interface</li>
                <li>• Floating action button</li>
                <li>• Modal-based interactions</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-yellow-400">Integration</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Seamless dashboard integration</li>
                <li>• Real-time report creation</li>
                <li>• Authority dashboard visibility</li>
                <li>• Audio feedback and confirmations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card-dark p-6">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Enable Permissions</h3>
                <p className="text-sm text-gray-300">
                  Allow microphone and location access when prompted
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-500/20 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Tap & Speak</h3>
                <p className="text-sm text-gray-300">
                  Tap the voice button and speak clearly about the issue
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Confirm & Submit</h3>
                <p className="text-sm text-gray-300">
                  Listen for confirmation and your report is automatically created
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2024 City Pulse Voice Assistant Demo</p>
          <p>Experience the future of civic engagement</p>
        </div>
      </div>
    </div>
  );
}
