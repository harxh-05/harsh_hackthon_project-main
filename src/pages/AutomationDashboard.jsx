import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Plus, Settings, Play, Pause, AlertTriangle, CheckCircle, Clock, Mail, MessageSquare, Droplets, Thermometer } from 'lucide-react';
import RuleBuilder from '../components/RuleBuilder';
import AlertSystem from '../components/AlertSystem';
import IrrigationController from '../components/IrrigationController';
import EmergencyOverride from '../components/EmergencyOverride';
import { automationService } from '../services/automationService';

const AutomationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState([]);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [systemStats, setSystemStats] = useState({
    activeRules: 0,
    triggeredToday: 0,
    alertsSent: 0,
    systemUptime: '99.8%'
  });

  useEffect(() => {
    loadRules();
    loadSystemStats();
  }, []);

  const loadRules = async () => {
    const rulesData = await automationService.getRules();
    setRules(rulesData);
  };

  const loadSystemStats = async () => {
    const stats = await automationService.getSystemStats();
    setSystemStats(stats);
  };

  const handleSystemToggle = async () => {
    const newState = !isSystemActive;
    setIsSystemActive(newState);
    await automationService.toggleSystem(newState);
  };

  const tabs = [
    { id: 'rules', label: 'Rule Builder', icon: <Zap className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert System', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'irrigation', label: 'Irrigation Control', icon: <Droplets className="w-4 h-4" /> },
    { id: 'emergency', label: 'Emergency Override', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-4 py-2 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-green-400">Farm Automation</h1>
              <p className="text-gray-400">Smart Rules & Workflows</p>
            </div>
          </div>
          
          {/* System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm">{isSystemActive ? 'System Active' : 'System Paused'}</span>
            </div>
            <button
              onClick={handleSystemToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSystemActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isSystemActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSystemActive ? 'Pause System' : 'Start System'}
            </button>
          </div>
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Rules</p>
                <p className="text-2xl font-bold text-green-400">{systemStats.activeRules}</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Triggered Today</p>
                <p className="text-2xl font-bold text-blue-400">{systemStats.triggeredToday}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Alerts Sent</p>
                <p className="text-2xl font-bold text-yellow-400">{systemStats.alertsSent}</p>
              </div>
              <Mail className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Uptime</p>
                <p className="text-2xl font-bold text-purple-400">{systemStats.systemUptime}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800">
          {activeTab === 'rules' && (
            <RuleBuilder 
              rules={rules} 
              onRulesChange={setRules}
              isSystemActive={isSystemActive}
            />
          )}
          {activeTab === 'alerts' && (
            <AlertSystem 
              isSystemActive={isSystemActive}
            />
          )}
          {activeTab === 'irrigation' && (
            <IrrigationController 
              isSystemActive={isSystemActive}
            />
          )}
          {activeTab === 'emergency' && (
            <EmergencyOverride 
              onSystemToggle={handleSystemToggle}
              isSystemActive={isSystemActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;