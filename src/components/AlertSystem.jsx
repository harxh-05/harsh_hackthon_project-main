import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Settings, Bell, Users, Clock } from 'lucide-react';
import { automationService } from '../services/automationService';

const AlertSystem = ({ isSystemActive }) => {
  const [alertConfig, setAlertConfig] = useState({
    email: {
      enabled: true,
      recipients: ['farmer@example.com'],
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        username: '',
        password: ''
      }
    },
    sms: {
      enabled: false,
      recipients: ['+1234567890'],
      provider: 'twilio',
      apiKey: '',
      apiSecret: ''
    },
    notifications: {
      criticalOnly: false,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '06:00'
      }
    }
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadAlertConfig();
    loadRecentAlerts();
  }, []);

  const loadAlertConfig = async () => {
    const config = await automationService.getAlertConfig();
    setAlertConfig(config);
  };

  const loadRecentAlerts = async () => {
    const alerts = await automationService.getRecentAlerts();
    setRecentAlerts(alerts);
  };

  const handleSaveConfig = async () => {
    await automationService.saveAlertConfig(alertConfig);
    alert('Alert configuration saved successfully!');
  };

  const handleTestAlert = async (type) => {
    setTestResult({ type, status: 'sending' });
    try {
      const result = await automationService.sendTestAlert(type, alertConfig);
      setTestResult({ type, status: 'success', message: result.message });
    } catch (error) {
      setTestResult({ type, status: 'error', message: error.message });
    }
    setTimeout(() => setTestResult(null), 5000);
  };

  const addRecipient = (type) => {
    const newRecipient = type === 'email' ? 'new@example.com' : '+1234567890';
    setAlertConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        recipients: [...prev[type].recipients, newRecipient]
      }
    }));
  };

  const removeRecipient = (type, index) => {
    setAlertConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        recipients: prev[type].recipients.filter((_, i) => i !== index)
      }
    }));
  };

  const updateRecipient = (type, index, value) => {
    setAlertConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        recipients: prev[type].recipients.map((recipient, i) => 
          i === index ? value : recipient
        )
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Alert System</h2>
        <button
          onClick={handleSaveConfig}
          disabled={!isSystemActive}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Configuration */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Email Alerts</h3>
            <label className="flex items-center ml-auto">
              <input
                type="checkbox"
                checked={alertConfig.email.enabled}
                onChange={(e) => setAlertConfig(prev => ({
                  ...prev,
                  email: { ...prev.email, enabled: e.target.checked }
                }))}
                className="mr-2"
              />
              <span className="text-white">Enabled</span>
            </label>
          </div>

          {alertConfig.email.enabled && (
            <div className="space-y-4">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recipients</label>
                <div className="space-y-2">
                  {alertConfig.email.recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => updateRecipient('email', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeRecipient('email', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRecipient('email')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Recipient
                  </button>
                </div>
              </div>

              {/* SMTP Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={alertConfig.email.smtp.host}
                    onChange={(e) => setAlertConfig(prev => ({
                      ...prev,
                      email: {
                        ...prev.email,
                        smtp: { ...prev.email.smtp, host: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
                  <input
                    type="number"
                    value={alertConfig.email.smtp.port}
                    onChange={(e) => setAlertConfig(prev => ({
                      ...prev,
                      email: {
                        ...prev.email,
                        smtp: { ...prev.email.smtp, port: parseInt(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleTestAlert('email')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Send Test Email
              </button>
            </div>
          )}
        </div>

        {/* SMS Configuration */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">SMS Alerts</h3>
            <label className="flex items-center ml-auto">
              <input
                type="checkbox"
                checked={alertConfig.sms.enabled}
                onChange={(e) => setAlertConfig(prev => ({
                  ...prev,
                  sms: { ...prev.sms, enabled: e.target.checked }
                }))}
                className="mr-2"
              />
              <span className="text-white">Enabled</span>
            </label>
          </div>

          {alertConfig.sms.enabled && (
            <div className="space-y-4">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Numbers</label>
                <div className="space-y-2">
                  {alertConfig.sms.recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="tel"
                        value={recipient}
                        onChange={(e) => updateRecipient('sms', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => removeRecipient('sms', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRecipient('sms')}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    + Add Phone Number
                  </button>
                </div>
              </div>

              {/* Provider Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMS Provider</label>
                <select
                  value={alertConfig.sms.provider}
                  onChange={(e) => setAlertConfig(prev => ({
                    ...prev,
                    sms: { ...prev.sms, provider: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws-sns">AWS SNS</option>
                  <option value="nexmo">Nexmo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                  <input
                    type="password"
                    value={alertConfig.sms.apiKey}
                    onChange={(e) => setAlertConfig(prev => ({
                      ...prev,
                      sms: { ...prev.sms, apiKey: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">API Secret</label>
                  <input
                    type="password"
                    value={alertConfig.sms.apiSecret}
                    onChange={(e) => setAlertConfig(prev => ({
                      ...prev,
                      sms: { ...prev.sms, apiSecret: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleTestAlert('sms')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Send Test SMS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`mt-6 p-4 rounded-lg border ${
          testResult.status === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' :
          testResult.status === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
          'bg-blue-900/20 border-blue-500/30 text-blue-300'
        }`}>
          <p className="font-medium">
            {testResult.status === 'sending' ? `Sending test ${testResult.type}...` :
             testResult.status === 'success' ? `Test ${testResult.type} sent successfully!` :
             `Test ${testResult.type} failed`}
          </p>
          {testResult.message && <p className="text-sm mt-1">{testResult.message}</p>}
        </div>
      )}

      {/* Recent Alerts */}
      <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          Recent Alerts
        </h3>
        
        {recentAlerts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent alerts</p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{alert.title}</p>
                  <p className="text-gray-400 text-sm">{alert.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{new Date(alert.timestamp).toLocaleString()}</p>
                  <div className="flex gap-1 mt-1">
                    {alert.channels.includes('email') && <Mail className="w-4 h-4 text-blue-400" />}
                    {alert.channels.includes('sms') && <MessageSquare className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertSystem;