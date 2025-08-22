// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Replace with your actual Google Maps API key
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyClHUIDx_M7Zc1QAOCb7kaAh3BWVGVRNEw',
  
  // Default center (Pune, India)
  DEFAULT_CENTER: {
    lat: 18.5204,
    lng: 73.8567
  },
  
  // Map options
  MAP_OPTIONS: {
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  }
};

// Instructions for setting up Google Maps API:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select existing one
// 3. Enable Maps JavaScript API
// 4. Create credentials (API Key)
// 5. Add the API key to your .env.local file:
//    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
// 6. Restrict the API key to your domain for security

// For development, you can use a test key or disable maps temporarily
export const isGoogleMapsConfigured = () => {
  return GOOGLE_MAPS_CONFIG.API_KEY !== 'AIzaSyClHUIDx_M7Zc1QAOCb7kaAh3BWVGVRNEw' && 
         GOOGLE_MAPS_CONFIG.API_KEY !== undefined && 
         GOOGLE_MAPS_CONFIG.API_KEY !== 'AIzaSyClHUIDx_M7Zc1QAOCb7kaAh3BWVGVRNEw';
};
