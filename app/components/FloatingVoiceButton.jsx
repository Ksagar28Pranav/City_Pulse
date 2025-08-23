import { useState, useEffect, useRef } from "react";
import { createReport } from "../api/page";

export default function FloatingVoiceButton({ token, onReportCreated }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening
      recognitionRef.current.interimResults = true; // Get interim results
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setFeedback("🎤 Listening... Speak now!");
        speak("I'm listening. Please describe the issue and location.");
      };

      recognitionRef.current.onresult = (event) => {
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

        // Show interim results while speaking
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }

        // Process final result when user stops speaking
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          setFeedback("❌ Error: " + event.error);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Get user location on component mount
    getUserLocation();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current.speak(utterance);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocationEnabled(true);
        },
        (error) => {
          console.error('Location error:', error);
          setIsLocationEnabled(false);
        }
      );
    }
  };

  const processVoiceCommand = async (command) => {
    setIsProcessing(true);
    setFeedback("🔄 Processing...");
    
    try {
      const parsedData = parseVoiceCommand(command);
      
      if (parsedData) {
        const reportData = {
          type: parsedData.issueType,
          description: parsedData.description,
          lat: userLocation?.lat || parsedData.lat,
          lng: userLocation?.lng || parsedData.lng,
          voiceCommand: command
        };

        const response = await createReport(reportData, token);
        
        setFeedback(`✅ Report created! ${parsedData.issueType} at ${parsedData.location}`);
        speak(`Report submitted successfully. A ${parsedData.issueType} issue has been reported at ${parsedData.location}.`);
        
        if (onReportCreated) {
          onReportCreated(response.data);
        }
        
        setTimeout(() => {
          setTranscript("");
          setFeedback("");
          setShowModal(false);
        }, 3000);
        
      } else {
        setFeedback("❌ Could not understand. Try again.");
        speak("I couldn't understand your command. Please try speaking more clearly.");
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      setFeedback("❌ Error creating report. Please try again.");
      speak("Sorry, there was an error creating your report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    const issueTypes = {
      'pothole': ['pothole', 'pot hole', 'road damage', 'hole in road', 'road hole'],
      'streetlight': ['streetlight', 'street light', 'light', 'lamp post', 'street lamp', 'light not working'],
      'garbage': ['garbage', 'trash', 'waste', 'rubbish', 'litter', 'garbage collection'],
      'traffic': ['traffic signal', 'traffic light', 'signal', 'traffic', 'traffic signal broken'],
      'sidewalk': ['sidewalk', 'footpath', 'walkway', 'pavement'],
      'water': ['water leak', 'water', 'leak', 'pipe'],
      'sewer': ['sewer', 'drain', 'sewage'],
      'tree': ['tree', 'branch', 'fallen tree'],
      'street sign': ['street sign', 'sign', 'road sign']
    };

    const nashikLocations = {
      'trimbak highway': { lat: 19.9317, lng: 73.5316 },
      'nashik road': { lat: 19.9975, lng: 73.7898 },
      'mumbai nashik highway': { lat: 19.9975, lng: 73.7898 },
      'nashik city': { lat: 19.9975, lng: 73.7898 },
      'panchavati': { lat: 19.9975, lng: 73.7898 },
      'old nashik': { lat: 19.9975, lng: 73.7898 },
      'new nashik': { lat: 19.9975, lng: 73.7898 },
      'satpur': { lat: 19.9975, lng: 73.7898 },
      'ambad': { lat: 19.9975, lng: 73.7898 },
      'gangapur road': { lat: 19.9975, lng: 73.7898 },
      'college road': { lat: 19.9975, lng: 73.7898 },
      'sharanpur road': { lat: 19.9975, lng: 73.7898 }
    };

    let detectedIssueType = null;
    for (const [issueType, variations] of Object.entries(issueTypes)) {
      if (variations.some(variation => lowerCommand.includes(variation))) {
        detectedIssueType = issueType;
        break;
      }
    }

    let detectedLocation = null;
    let detectedCoords = null;
    
    for (const [location, coords] of Object.entries(nashikLocations)) {
      if (lowerCommand.includes(location)) {
        detectedLocation = location;
        detectedCoords = coords;
        break;
      }
    }

    if (!detectedLocation && userLocation) {
      detectedLocation = "current location";
      detectedCoords = userLocation;
    }

    if (detectedIssueType && detectedLocation) {
      return {
        issueType: detectedIssueType,
        location: detectedLocation,
        description: command,
        lat: detectedCoords?.lat,
        lng: detectedCoords?.lng
      };
    }

    return null;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      setFeedback("❌ Speech recognition not supported.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleVoiceButtonClick = () => {
    if (!isLocationEnabled) {
      setFeedback("📍 Please enable location access first");
      return;
    }
    setShowModal(true);
    setFeedback("");
    setTranscript("");
  };

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={handleVoiceButtonClick}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        title="Voice Report"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        
        {/* Location indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isLocationEnabled ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </button>

      {/* Voice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Voice Report</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Location Status */}
            <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isLocationEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-300">
                {isLocationEnabled ? '📍 Location enabled' : '📍 Location required'}
              </span>
            </div>

            {/* Voice Button */}
            <div className="flex justify-center py-4">
              <button
                onClick={toggleListening}
                disabled={isProcessing || !isLocationEnabled}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                    : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {isListening ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Status */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-white">
                {isListening ? "🎤 Listening..." : isProcessing ? "🔄 Processing..." : "Tap to speak"}
              </p>
              {feedback && (
                <div className={`p-2 rounded-lg text-xs ${
                  feedback.includes('✅') 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : feedback.includes('❌')
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                }`}>
                  {feedback}
                </div>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xs font-medium text-gray-300 mb-1">Voice Input:</h3>
                <p className="text-white italic text-sm">"{transcript}"</p>
              </div>
            )}

            {/* Examples */}
            <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-sm font-semibold mb-2 text-white">Examples:</h3>
              <div className="space-y-1 text-xs text-gray-300">
                <p>• "Pothole on Trimbak Highway"</p>
                <p>• "Streetlight not working on College Road"</p>
                <p>• "Garbage issue in Panchavati"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
