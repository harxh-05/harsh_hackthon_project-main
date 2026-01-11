import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Thermometer, Droplets, Zap } from 'lucide-react';

const InteractiveMap = ({ sensors, selectedSensor, onSensorSelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Mock coordinates for demo (replace with actual GPS data)
  const defaultCenter = [28.6139, 77.2090]; // Delhi coordinates
  
  useEffect(() => {
    // Initialize map (using a simple implementation without external libraries)
    if (mapRef.current && !map) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map && sensors.length > 0) {
      updateMarkers();
    }
  }, [sensors, map]);

  const initializeMap = () => {
    // Simple map implementation using CSS and positioning
    const mapElement = mapRef.current;
    mapElement.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`;
    setMap(mapElement);
  };

  const updateMarkers = () => {
    // Clear existing markers
    const existingMarkers = mapRef.current.querySelectorAll('.sensor-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    sensors.forEach((sensor, index) => {
      const marker = createMarker(sensor, index);
      mapRef.current.appendChild(marker);
    });
  };

  const createMarker = (sensor, index) => {
    const marker = document.createElement('div');
    marker.className = `sensor-marker absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10`;
    marker.style.left = `${30 + (index % 3) * 25}%`;
    marker.style.top = `${30 + Math.floor(index / 3) * 20}%`;
    
    const isSelected = selectedSensor?.id === sensor.id;
    const statusColor = getSensorStatusColor(sensor);
    
    marker.innerHTML = `
      <div class="relative">
        <div class="w-12 h-12 rounded-full ${statusColor} ${isSelected ? 'ring-4 ring-green-400' : ''} 
                    flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
          ${getSensorIconSVG(sensor.type)}
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap
                    ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'} transition-opacity">
          ${sensor.name}: ${sensor.value}${sensor.unit}
        </div>
        <div class="absolute top-0 left-0 w-12 h-12 rounded-full ${statusColor} animate-ping opacity-20"></div>
      </div>
    `;
    
    marker.addEventListener('click', () => onSensorSelect(sensor));
    return marker;
  };

  const getSensorStatusColor = (sensor) => {
    if (sensor.type === 'moisture') {
      if (sensor.value < 30) return 'bg-red-500';
      if (sensor.value > 70) return 'bg-blue-500';
      return 'bg-green-500';
    }
    if (sensor.type === 'temperature') {
      if (sensor.value < 15 || sensor.value > 35) return 'bg-red-500';
      return 'bg-green-500';
    }
    return 'bg-green-500';
  };

  const getSensorIconSVG = (type) => {
    const iconClass = "w-6 h-6 text-white";
    switch (type) {
      case 'temperature':
        return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a4 4 0 00-4 4v6a6 6 0 1012 0V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v6.5a4 4 0 11-4 0V6z"/>
        </svg>`;
      case 'moisture':
        return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2s-6 6-6 10a6 6 0 1012 0c0-4-6-10-6-10z"/>
        </svg>`;
      case 'ph':
        return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z"/>
        </svg>`;
      default:
        return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    }
  };

  const generateHeatmapOverlay = () => {
    if (!sensors.length) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {sensors.map((sensor, index) => (
          <div
            key={sensor.id}
            className="absolute w-32 h-32 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${25 + (index % 3) * 25}%`,
              top: `${25 + Math.floor(index / 3) * 20}%`,
              background: `radial-gradient(circle, ${
                sensor.type === 'moisture' 
                  ? sensor.value < 30 ? '#ef4444' : sensor.value > 70 ? '#3b82f6' : '#10b981'
                  : sensor.type === 'temperature'
                  ? sensor.value < 15 || sensor.value > 35 ? '#ef4444' : '#10b981'
                  : '#10b981'
              } 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-green-900/20 to-blue-900/20"
        style={{
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
      >
        {/* Grid overlay for farm field appearance */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-green-400/20" />
            ))}
          </div>
        </div>

        {/* Heatmap overlay */}
        {generateHeatmapOverlay()}

        {/* Field boundaries */}
        <div className="absolute inset-4 border-2 border-green-400/30 rounded-lg">
          <div className="absolute top-2 left-2 text-green-400 text-sm font-medium">
            Field A - Main Crop Area
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-lg rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Sensor Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">High Moisture</span>
            </div>
          </div>
        </div>

        {/* Selected sensor info */}
        {selectedSensor && (
          <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-lg rounded-lg p-4 min-w-64">
            <h3 className="text-green-400 font-medium mb-2">{selectedSensor.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{selectedSensor.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Value:</span>
                <span className="text-white">{selectedSensor.value}{selectedSensor.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`${getSensorStatusColor(selectedSensor) === 'bg-green-500' ? 'text-green-400' : 'text-red-400'}`}>
                  {getSensorStatusColor(selectedSensor) === 'bg-green-500' ? 'Normal' : 'Alert'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update:</span>
                <span className="text-white">{new Date(selectedSensor.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;