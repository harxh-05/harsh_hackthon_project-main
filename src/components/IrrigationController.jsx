import React, { useState, useEffect } from 'react';
import { Droplets, Play, Pause, Settings, Wifi, WifiOff, Gauge } from 'lucide-react';
import { automationService } from '../services/automationService';

const IrrigationController = ({ isSystemActive }) => {
  const [controllers, setControllers] = useState([]);
  const [selectedController, setSelectedController] = useState(null);
  const [manualControl, setManualControl] = useState({
    zone: 1,
    duration: 15,
    intensity: 50
  });

  useEffect(() => {
    loadControllers();
  }, []);

  const loadControllers = async () => {
    const controllersData = await automationService.getIrrigationControllers();
    setControllers(controllersData);
    if (controllersData.length > 0) {
      setSelectedController(controllersData[0]);
    }
  };

  const handleManualIrrigation = async () => {
    if (!selectedController) return;
    
    try {
      await automationService.startManualIrrigation(
        selectedController.id,
        manualControl.zone,
        manualControl.duration,
        manualControl.intensity
      );
      alert('Manual irrigation started successfully!');
      loadControllers(); // Refresh status
    } catch (error) {
      alert('Failed to start irrigation: ' + error.message);
    }
  };

  const handleStopIrrigation = async (controllerId, zone) => {
    try {
      await automationService.stopIrrigation(controllerId, zone);
      alert('Irrigation stopped successfully!');
      loadControllers(); // Refresh status
    } catch (error) {
      alert('Failed to stop irrigation: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'idle': return 'text-blue-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'idle': return <Pause className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Irrigation Control</h2>
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">{controllers.filter(c => c.status !== 'offline').length} of {controllers.length} controllers online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controllers List */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Irrigation Controllers</h3>
          
          {controllers.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
              <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No irrigation controllers configured</p>
              <p className="text-sm text-gray-500 mt-2">Add controllers to manage irrigation systems</p>
            </div>
          ) : (
            <div className="space-y-4">
              {controllers.map((controller) => (
                <div 
                  key={controller.id} 
                  className={`bg-gray-800/50 rounded-lg p-6 border cursor-pointer transition-all ${
                    selectedController?.id === controller.id 
                      ? 'border-green-400/50 bg-green-900/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedController(controller)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-6 h-6 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">{controller.name}</h4>
                        <p className="text-gray-400 text-sm">{controller.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${getStatusColor(controller.status)}`}>
                        {getStatusIcon(controller.status)}
                        <span className="capitalize text-sm">{controller.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Zones */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {controller.zones.map((zone) => (
                      <div key={zone.id} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">Zone {zone.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            zone.isActive 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {zone.isActive ? 'Active' : 'Idle'}
                          </span>
                        </div>
                        
                        {zone.isActive && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Time left:</span>
                              <span className="text-white">{zone.timeRemaining}min</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Flow rate:</span>
                              <span className="text-white">{zone.flowRate}L/min</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStopIrrigation(controller.id, zone.id);
                              }}
                              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded transition-colors"
                            >
                              Stop
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Controller Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Water Pressure</p>
                      <p className="text-white font-medium">{controller.waterPressure} PSI</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Flow Rate</p>
                      <p className="text-white font-medium">{controller.totalFlowRate} L/min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Daily Usage</p>
                      <p className="text-white font-medium">{controller.dailyUsage} L</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Control Panel */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-400" />
            Manual Control
          </h3>

          {!selectedController ? (
            <p className="text-gray-400 text-center py-8">Select a controller to enable manual control</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Controller</label>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-white font-medium">{selectedController.name}</p>
                  <p className="text-gray-400 text-sm">{selectedController.location}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zone</label>
                <select
                  value={manualControl.zone}
                  onChange={(e) => setManualControl(prev => ({ ...prev, zone: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                >
                  {selectedController.zones.map((zone) => (
                    <option key={zone.id} value={zone.id} disabled={zone.isActive}>
                      Zone {zone.id} {zone.isActive ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration: {manualControl.duration} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={manualControl.duration}
                  onChange={(e) => setManualControl(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Intensity: {manualControl.intensity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={manualControl.intensity}
                  onChange={(e) => setManualControl(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>

              <button
                onClick={handleManualIrrigation}
                disabled={!isSystemActive || selectedController.status === 'offline'}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Irrigation
              </button>

              {selectedController.status === 'offline' && (
                <p className="text-red-400 text-sm text-center">Controller is offline</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-400" />
          System Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Total Controllers</p>
            <p className="text-2xl font-bold text-white">{controllers.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Active Zones</p>
            <p className="text-2xl font-bold text-green-400">
              {controllers.reduce((sum, c) => sum + c.zones.filter(z => z.isActive).length, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Total Flow Rate</p>
            <p className="text-2xl font-bold text-blue-400">
              {controllers.reduce((sum, c) => sum + c.totalFlowRate, 0)} L/min
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Daily Usage</p>
            <p className="text-2xl font-bold text-yellow-400">
              {controllers.reduce((sum, c) => sum + c.dailyUsage, 0)} L
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationController;