import React, { useState } from 'react';
import { AlertTriangle, Power, Shield, StopCircle, Phone, Mail } from 'lucide-react';
import { automationService } from '../services/automationService';

const EmergencyOverride = ({ onSystemToggle, isSystemActive }) => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');

  const emergencyActions = [
    {
      id: 'stop_all_irrigation',
      title: 'Stop All Irrigation',
      description: 'Immediately stop all active irrigation zones',
      icon: <StopCircle className="w-6 h-6" />,
      color: 'red',
      severity: 'high'
    },
    {
      id: 'disable_automation',
      title: 'Disable All Automation',
      description: 'Pause all automated rules and workflows',
      icon: <Power className="w-6 h-6" />,
      color: 'yellow',
      severity: 'medium'
    },
    {
      id: 'emergency_drainage',
      title: 'Emergency Drainage',
      description: 'Activate emergency drainage systems',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'orange',
      severity: 'high'
    },
    {
      id: 'alert_emergency_contacts',
      title: 'Alert Emergency Contacts',
      description: 'Send immediate alerts to all emergency contacts',
      icon: <Phone className="w-6 h-6" />,
      color: 'blue',
      severity: 'medium'
    }
  ];

  const handleEmergencyAction = async (actionId) => {
    if (confirmAction !== actionId) {
      setConfirmAction(actionId);
      setTimeout(() => setConfirmAction(''), 5000); // Reset after 5 seconds
      return;
    }

    try {
      await automationService.executeEmergencyAction(actionId);
      
      // Special handling for system disable
      if (actionId === 'disable_automation') {
        onSystemToggle();
      }
      
      alert(`Emergency action "${actionId}" executed successfully!`);
      setConfirmAction('');
    } catch (error) {
      alert('Failed to execute emergency action: ' + error.message);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-600 hover:bg-red-700 border-red-500',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500',
      orange: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
      blue: 'bg-blue-600 hover:bg-blue-700 border-blue-500'
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            Emergency Override
          </h2>
          <p className="text-gray-400 mt-1">Critical system controls and emergency procedures</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg border ${
            emergencyMode 
              ? 'bg-red-900/50 border-red-500 text-red-300' 
              : 'bg-gray-800 border-gray-600 text-gray-300'
          }`}>
            <span className="text-sm font-medium">
              {emergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Normal Operation'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-300 font-semibold mb-2">⚠️ Emergency Controls Warning</h3>
            <p className="text-red-200 text-sm mb-3">
              These controls are for emergency situations only. Actions taken here will immediately affect 
              all farm operations and may cause system-wide changes.
            </p>
            <ul className="text-red-200 text-sm space-y-1">
              <li>• All emergency actions are logged and cannot be undone</li>
              <li>• Emergency contacts will be notified of critical actions</li>
              <li>• Click twice to confirm any emergency action</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {emergencyActions.map((action) => (
          <div key={action.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(action.color).split(' ')[0]}/20`}>
                <div className={`text-${action.color}-400`}>
                  {action.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{action.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.severity === 'high' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {action.severity.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleEmergencyAction(action.id)}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                confirmAction === action.id
                  ? `${getColorClasses(action.color)} text-white animate-pulse`
                  : `bg-gray-700 hover:bg-gray-600 border-gray-600 text-white hover:border-${action.color}-500`
              }`}
            >
              {confirmAction === action.id ? 'CLICK AGAIN TO CONFIRM' : `Execute ${action.title}`}
            </button>
            
            {confirmAction === action.id && (
              <p className="text-yellow-400 text-xs text-center mt-2 animate-pulse">
                ⚠️ Confirmation required - Click again within 5 seconds
              </p>
            )}
          </div>
        ))}
      </div>

      {/* System Status Panel */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Power className="w-5 h-5 text-green-400" />
          System Status & Controls
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System Power */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              isSystemActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <Power className="w-8 h-8" />
            </div>
            <p className="text-white font-medium mb-2">Automation System</p>
            <p className={`text-sm mb-3 ${isSystemActive ? 'text-green-400' : 'text-red-400'}`}>
              {isSystemActive ? 'ACTIVE' : 'PAUSED'}
            </p>
            <button
              onClick={onSystemToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isSystemActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isSystemActive ? 'Pause System' : 'Start System'}
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mx-auto mb-3 flex items-center justify-center">
              <Phone className="w-8 h-8" />
            </div>
            <p className="text-white font-medium mb-2">Emergency Contacts</p>
            <p className="text-gray-400 text-sm mb-3">3 contacts configured</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Call Emergency
            </button>
          </div>

          {/* System Logs */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 mx-auto mb-3 flex items-center justify-center">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-white font-medium mb-2">Emergency Logs</p>
            <p className="text-gray-400 text-sm mb-3">All actions recorded</p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              View Logs
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Emergency Procedures</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-green-400 font-medium mb-2">🌊 Flood Emergency</h4>
            <ol className="text-gray-300 space-y-1 list-decimal list-inside">
              <li>Stop all irrigation immediately</li>
              <li>Activate emergency drainage</li>
              <li>Alert emergency contacts</li>
              <li>Document water levels</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-yellow-400 font-medium mb-2">🔥 Fire Emergency</h4>
            <ol className="text-gray-300 space-y-1 list-decimal list-inside">
              <li>Disable all automation</li>
              <li>Call fire department</li>
              <li>Evacuate personnel</li>
              <li>Activate fire suppression</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-red-400 font-medium mb-2">⚡ Power Failure</h4>
            <ol className="text-gray-300 space-y-1 list-decimal list-inside">
              <li>Switch to backup power</li>
              <li>Prioritize critical systems</li>
              <li>Monitor battery levels</li>
              <li>Contact utility company</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-blue-400 font-medium mb-2">🌡️ Extreme Weather</h4>
            <ol className="text-gray-300 space-y-1 list-decimal list-inside">
              <li>Secure equipment</li>
              <li>Adjust irrigation schedule</li>
              <li>Monitor crop conditions</li>
              <li>Prepare for recovery</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOverride;