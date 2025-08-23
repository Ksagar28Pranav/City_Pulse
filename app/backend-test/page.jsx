"use client"
import { useState } from "react";
import { createReport } from "../api/page";

export default function BackendTestPage() {
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResult("Testing backend connection...");

    try {
      // Test with sample data
      const testData = {
        type: "pothole",
        description: "Test report from voice assistant",
        lat: 19.9975,
        lng: 73.7898,
        location: "Test Location",
        voiceCommand: "Test voice command"
      };

      console.log("🧪 Testing with data:", testData);
      const response = await createReport(testData, "test-token");
      
      console.log("✅ Backend test successful:", response.data);
      setTestResult(`✅ Backend connection successful! Report created with ID: ${response.data._id}`);
    } catch (error) {
      console.error("❌ Backend test failed:", error);
      
      if (error.response) {
        setTestResult(`❌ Backend error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setTestResult("❌ Network error: Backend server not responding. Make sure it's running on port 5000.");
      } else {
        setTestResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🧪 Backend Test</h1>
          <p className="text-lg text-gray-300">Test the backend API connection</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
          
          <button
            onClick={testBackendConnection}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.includes('✅') 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}>
              <h3 className="font-bold mb-2">Test Result:</h3>
              <p className="text-sm">{testResult}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">Backend Requirements:</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Backend server</strong> must be running on port 5000</li>
            <li>• <strong>Database</strong> must be connected</li>
            <li>• <strong>API endpoints</strong> must be working</li>
            <li>• <strong>CORS</strong> must be configured for localhost:3001</li>
          </ul>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">Troubleshooting:</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Start backend:</strong> <code>cd backend && npm start</code></li>
            <li>• <strong>Check port 5000:</strong> Make sure nothing else is using it</li>
            <li>• <strong>Check console:</strong> Look for backend startup messages</li>
            <li>• <strong>Check database:</strong> Ensure MongoDB is running</li>
          </ul>
        </div>

        <div className="text-center space-x-4">
          <a 
            href="/voice-test"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🎤 Test Voice Assistant
          </a>
          <a 
            href="/authPages/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🏠 Go to Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
