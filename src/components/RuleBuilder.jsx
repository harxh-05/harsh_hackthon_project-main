import React, { useState } from 'react';
import { Plus, Trash2, Edit, Play, Pause, Droplets, Thermometer, Zap, Clock } from 'lucide-react';
import { automationService } from '../services/automationService';

const RuleBuilder = ({ rules, onRulesChange, isSystemActive }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: {
      sensor: 'soilMoisture',
      operator: '<',
      value: '',
      unit: '%'
    },
    action: {
      type: 'irrigation',
      duration: 15,
      intensity: 'medium'
    },
    notifications: {
      email: true,
      sms: false
    },
    schedule: {
      enabled: false,
      startTime: '06:00',
      endTime: '18:00'
    }
  });

  const sensorOptions = [
    { value: 'soilMoisture', label: 'Soil Moisture', unit: '%', icon: <Droplets className="w-4 h-4" /> },
    { value: 'temperature', label: 'Temperature', unit: '°C', icon: <Thermometer className="w-4 h-4" /> },
    { value: 'humidity', label: 'Humidity', unit: '%', icon: <Droplets className="w-4 h-4" /> },
    { value: 'ph', label: 'pH Level', unit: 'pH', icon: <Zap className="w-4 h-4" /> }
  ];

  const operatorOptions = [
    { value: '<', label: 'Less than' },
    { value: '>', label: 'Greater than' },
    { value: '=', label: 'Equal to' },
    { value: '<=', label: 'Less than or equal' },
    { value: '>=', label: 'Greater than or equal' }
  ];

  const actionOptions = [
    { value: 'irrigation', label: 'Start Irrigation' },
    { value: 'alert', label: 'Send Alert Only' },
    { value: 'fertilizer', label: 'Apply Fertilizer' },
    { value: 'ventilation', label: 'Adjust Ventilation' }
  ];

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.condition.value) return;
    
    const rule = {
      ...newRule,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      triggerCount: 0
    };
    
    const updatedRules = await automationService.createRule(rule);
    onRulesChange(updatedRules);
    setShowCreateForm(false);
    resetForm();
  };

  const handleToggleRule = async (ruleId) => {
    const updatedRules = await automationService.toggleRule(ruleId);
    onRulesChange(updatedRules);
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      const updatedRules = await automationService.deleteRule(ruleId);
      onRulesChange(updatedRules);
    }
  };

  const resetForm = () => {
    setNewRule({
      name: '',
      condition: {
        sensor: 'soilMoisture',
        operator: '<',
        value: '',
        unit: '%'
      },
      action: {
        type: 'irrigation',
        duration: 15,
        intensity: 'medium'
      },
      notifications: {
        email: true,
        sms: false
      },
      schedule: {
        enabled: false,
        startTime: '06:00',
        endTime: '18:00'
      }
    });
  };

  const getSensorIcon = (sensorType) => {
    const sensor = sensorOptions.find(s => s.value === sensorType);
    return sensor ? sensor.icon : <Zap className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Automation Rules</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={!isSystemActive}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      {/* Create Rule Form */}
      {showCreateForm && (
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-green-400/30">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Rule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Low Moisture Auto-Irrigation"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
              <div className="flex gap-2">
                <select
                  value={newRule.condition.sensor}
                  onChange={(e) => {
                    const sensor = sensorOptions.find(s => s.value === e.target.value);
                    setNewRule(prev => ({
                      ...prev,
                      condition: { ...prev.condition, sensor: e.target.value, unit: sensor.unit }
                    }));
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                >
                  {sensorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <select
                  value={newRule.condition.operator}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    condition: { ...prev.condition, operator: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                >
                  {operatorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newRule.condition.value}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    condition: { ...prev.condition, value: e.target.value }
                  }))}
                  placeholder="Value"
                  className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                />
                <span className="px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-300">
                  {newRule.condition.unit}
                </span>
              </div>
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
              <select
                value={newRule.action.type}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  action: { ...prev.action, type: e.target.value }
                }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              >
                {actionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Duration (for irrigation) */}
            {newRule.action.type === 'irrigation' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newRule.action.duration}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    action: { ...prev.action, duration: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {/* Notifications */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notifications</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newRule.notifications.email}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-white">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newRule.notifications.sms}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-white">SMS</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateRule}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Rule
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No automation rules created yet</p>
            <p className="text-sm">Create your first rule to automate farm operations</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getSensorIcon(rule.condition.sensor)}
                  <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {rule.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Condition</p>
                  <p className="text-white">
                    {sensorOptions.find(s => s.value === rule.condition.sensor)?.label} {rule.condition.operator} {rule.condition.value}{rule.condition.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Action</p>
                  <p className="text-white">
                    {actionOptions.find(a => a.value === rule.action.type)?.label}
                    {rule.action.type === 'irrigation' && ` (${rule.action.duration}min)`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Triggered</p>
                  <p className="text-white">{rule.triggerCount} times</p>
                  {rule.lastTriggered && (
                    <p className="text-gray-400 text-xs">
                      Last: {new Date(rule.lastTriggered).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RuleBuilder;