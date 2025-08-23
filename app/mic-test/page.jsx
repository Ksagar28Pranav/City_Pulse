"use client"
import { useState, useEffect, useRef } from "react";

export default function MicTestPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [browserSupport, setBrowserSupport] = useState("");
  const [permissions, setPermissions] = useState("");
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    if (typeof window !== "undefined") {
      if (window.SpeechRecognition) {
        setBrowserSupport("✅ Standard SpeechRecognition supported");
      } else if (window.webkitSpeechRecognition) {
        setBrowserSupport("✅ Webkit SpeechRecognition supported");
      } else {
        setBrowserSupport("❌ SpeechRecognition not supported in this browser");
      }

      // Check microphone permissions
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setPermissions("✅ Microphone permission granted");
        })
        .catch((err) => {
          setPermissions(`❌ Microphone permission denied: ${err.message}`);
        });
    }
  }, []);

  const startListening = () => {
    setError("");
    setTranscript("");
    
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        setError("SpeechRecognition not supported in this browser");
        return;
      }

      recognitionRef.current = new SpeechRec();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError("");
        console.log("🎤 Speech recognition started");
      };

      recognitionRef.current.onresult = (event) => {
        console.log("🎤 Speech recognition result:", event);
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("🎤 Speech recognition error:", event);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log("🎤 Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (err) {
      console.error("🎤 Error starting speech recognition:", err);
      setError(`Failed to start: ${err.message}`);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🎤 Microphone Test</h1>
          <p className="text-lg text-gray-300">Debug speech recognition issues</p>
        </div>

        {/* Browser Support */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Browser Support:</h2>
          <p className="text-sm">{browserSupport}</p>
        </div>

        {/* Permissions */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Microphone Permissions:</h2>
          <p className="text-sm">{permissions}</p>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <h2 className="text-lg font-bold mb-4">Test Microphone:</h2>
          
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isListening 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isListening ? 'Listening...' : 'Start Listening'}
            </button>
            
            <button
              onClick={stopListening}
              disabled={!isListening}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !isListening 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Stop
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 mb-4">
              {error}
            </div>
          )}

          {transcript && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <h3 className="font-bold mb-2">Transcript:</h3>
              <p className="text-green-300">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Troubleshooting Steps:</h2>
          <ol className="space-y-2 text-sm">
            <li>1. <strong>Check browser support</strong> - Make sure you're using Chrome, Edge, or Safari</li>
            <li>2. <strong>Allow microphone permission</strong> - Click "Allow" when prompted</li>
            <li>3. <strong>Check browser settings</strong> - Go to Settings → Privacy → Site Settings → Microphone</li>
            <li>4. <strong>Try a different browser</strong> - Chrome works best for speech recognition</li>
            <li>5. <strong>Check console</strong> - Open DevTools (F12) and look for errors</li>
          </ol>
        </div>

        {/* Browser Info */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Browser Information:</h2>
          <p className="text-sm">User Agent: {typeof window !== "undefined" ? window.navigator.userAgent : "Unknown"}</p>
          <p className="text-sm">Browser: {typeof window !== "undefined" ? 
            (window.navigator.userAgent.includes("Chrome") ? "Chrome" :
             window.navigator.userAgent.includes("Firefox") ? "Firefox" :
             window.navigator.userAgent.includes("Safari") ? "Safari" :
             window.navigator.userAgent.includes("Edge") ? "Edge" : "Unknown") : "Unknown"}</p>
        </div>

        <div className="text-center">
          <a 
            href="/voice-test"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Voice Test
          </a>
        </div>

      </div>
    </div>
  );
}
