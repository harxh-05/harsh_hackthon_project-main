import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Droplets, Zap, Activity, Settings } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import SensorCard from '../components/SensorCard';
import { realtimeService } from '../services/realtimeService';

const IoTDashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize real-time connection
    realtimeService.connect();
    
    // Subscribe to sensor updates
    const unsubscribe = realtimeService.onSensorUpdate((sensorData) => {
      setSensors(prev => {
        const updated = [...prev];
        const index = updated.findIndex(s => s.id === sensorData.id);
        if (index >= 0) {
          updated[index] = { ...updated[index], ...sensorData };
        } else {
          updated.push(sensorData);
        }
        return updated;
      });
    });

    // Connection status
    realtimeService.onConnectionChange(setIsConnected);

    return () => {
      unsubscribe();
      realtimeService.disconnect();
    };
  }, []);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'moisture': return <Droplets className="w-5 h-5" />;
      case 'ph': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getSensorColor = (value, type) => {
    if (type === 'moisture') {
      if (value < 30) return 'text-red-400';
      if (value > 70) return 'text-blue-400';
      return 'text-green-400';
    }
    if (type === 'temperature') {
      if (value < 15 || value > 35) return 'text-red-400';
      return 'text-green-400';
    }
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">IoT Dashboard</h1>
            <p className="text-gray-400">Real-time farm monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Sensor List */}
        <div className="w-80 bg-gray-900/30 border-r border-gray-800 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-green-400">Active Sensors</h2>
          <div className="space-y-3">
            {sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                isSelected={selectedSensor?.id === sensor.id}
                onClick={() => setSelectedSensor(sensor)}
                icon={getSensorIcon(sensor.type)}
                colorClass={getSensorColor(sensor.value, sensor.type)}
              />
            ))}
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <InteractiveMap
            sensors={sensors}
            selectedSensor={selectedSensor}
            onSensorSelect={setSelectedSensor}
          />
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;