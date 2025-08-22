"use client"
import { useState, useEffect, useRef } from 'react';
import { GOOGLE_MAPS_CONFIG } from '../config/maps';

export default function GoogleMap({ onLocationSelect, initialLat, initialLng }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple script loading
    if (scriptLoadedRef.current) {
      if (window.google && window.google.maps) {
        initializeMap();
      }
      return;
    }

    // Check if script is already loaded
    if (window.google && window.google.maps) {
      scriptLoadedRef.current = true;
      initializeMap();
      return;
    }

    // Check if script is already in the process of loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        scriptLoadedRef.current = true;
        initializeMap();
      });
      return;
    }

    // Load Google Maps script
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeMap();
      };
      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key configuration.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      setError('Google Maps failed to load. Please check your API key.');
      setIsLoading(false);
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: selectedLocation || GOOGLE_MAPS_CONFIG.DEFAULT_CENTER,
        ...GOOGLE_MAPS_CONFIG.MAP_OPTIONS
      });

      setMap(mapInstance);

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        onLocationSelect(lat, lng);
        updateMarker(lat, lng);
      });

      // Initialize marker if coordinates are provided
      if (selectedLocation) {
        updateMarker(selectedLocation.lat, selectedLocation.lng);
      }

      // Get user location
      getUserLocation(mapInstance);
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Error initializing map. Please check your API key configuration.');
      setIsLoading(false);
    }
  };

  const getUserLocation = (mapInstance) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userPos = { lat, lng };
        
        setUserLocation(userPos);
        
        // If no location is selected, center map on user location
        if (!selectedLocation) {
          mapInstance.setCenter(userPos);
          setSelectedLocation(userPos);
          onLocationSelect(lat, lng);
          updateMarker(lat, lng);
        }
        
        // Add user location marker
        new window.google.maps.Marker({
          position: userPos,
          map: mapInstance,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: 'Your Location'
        });

        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enable location permissions or select a location manually.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const updateMarker = (lat, lng) => {
    if (marker) {
      marker.setMap(null);
    }

    if (map && window.google && window.google.maps) {
      try {
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
          title: 'Selected Location'
        });

        newMarker.addListener('dragend', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          setSelectedLocation({ lat: newLat, lng: newLng });
          onLocationSelect(newLat, newLng);
        });

        setMarker(newMarker);
      } catch (error) {
        console.error('Error updating marker:', error);
      }
    }
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
      onLocationSelect(userLocation.lat, userLocation.lng);
      if (map) {
        map.setCenter(userLocation);
        updateMarker(userLocation.lat, userLocation.lng);
      }
    }
  };

  const handleClearLocation = () => {
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
    setSelectedLocation(null);
    onLocationSelect(null, null);
  };

  // Show error if API key is not configured
  if (GOOGLE_MAPS_CONFIG.API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium">Google Maps API Key Required</p>
            <p className="text-sm">Please configure your Google Maps API key in the environment variables.</p>
            <p className="text-xs mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-2 text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Select Location</h3>
        <div className="flex space-x-2">
          {userLocation && (
            <button
              onClick={handleUseMyLocation}
              className="btn btn-primary text-sm px-3 py-1"
            >
              Use My Location
            </button>
          )}
          {selectedLocation && (
            <button
              onClick={handleClearLocation}
              className="btn btn-outline text-sm px-3 py-1 border-gray-600 hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <div className="spinner w-8 h-8 mx-auto mb-2"></div>
              <p className="text-sm text-gray-300">Loading map...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-600"
        />
      </div>

      {selectedLocation && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">
              Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        <p>• Click on the map to select a location</p>
        <p>• Drag the marker to adjust the position</p>
        <p>• Use "Use My Location" to get your current position</p>
      </div>
    </div>
  );
}
