// Automation Service for Farm Management
class AutomationService {
  constructor() {
    this.rules = this.loadRules();
    this.systemActive = true;
    this.alertConfig = this.getDefaultAlertConfig();
    this.irrigationControllers = this.getMockControllers();
  }

  // Rules Management
  async getRules() {
    return this.rules;
  }

  async createRule(rule) {
    this.rules.push(rule);
    this.saveRules();
    return this.rules;
  }

  async toggleRule(ruleId) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.isActive = !rule.isActive;
      this.saveRules();
    }
    return this.rules;
  }

  async deleteRule(ruleId) {
    this.rules = this.rules.filter(r => r.id !== ruleId);
    this.saveRules();
    return this.rules;
  }

  // System Management
  async toggleSystem(active) {
    this.systemActive = active;
    console.log(`Automation system ${active ? 'activated' : 'paused'}`);
    return this.systemActive;
  }

  async getSystemStats() {
    return {
      activeRules: this.rules.filter(r => r.isActive).length,
      triggeredToday: Math.floor(Math.random() * 15) + 5,
      alertsSent: Math.floor(Math.random() * 8) + 2,
      systemUptime: '99.8%'
    };
  }

  // Alert System
  async getAlertConfig() {
    return this.alertConfig;
  }

  async saveAlertConfig(config) {
    this.alertConfig = config;
    localStorage.setItem('alertConfig', JSON.stringify(config));
    return true;
  }

  async sendTestAlert(type, config) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'email') {
      if (!config.email.smtp.host) {
        throw new Error('SMTP host not configured');
      }
      return { success: true, message: 'Test email sent successfully to all recipients' };
    } else if (type === 'sms') {
      if (!config.sms.apiKey) {
        throw new Error('SMS API key not configured');
      }
      return { success: true, message: 'Test SMS sent successfully to all phone numbers' };
    }
  }

  async getRecentAlerts() {
    return [
      {
        title: 'Low Soil Moisture Alert',
        message: 'Zone 1 moisture dropped below 25%',
        timestamp: Date.now() - 3600000,
        channels: ['email', 'sms']
      },
      {
        title: 'Irrigation Started',
        message: 'Auto-irrigation activated for 15 minutes',
        timestamp: Date.now() - 7200000,
        channels: ['email']
      },
      {
        title: 'System Maintenance',
        message: 'Weekly system health check completed',
        timestamp: Date.now() - 86400000,
        channels: ['email']
      }
    ];
  }

  // Irrigation Control
  async getIrrigationControllers() {
    return this.irrigationControllers;
  }

  async startManualIrrigation(controllerId, zone, duration, intensity) {
    const controller = this.irrigationControllers.find(c => c.id === controllerId);
    if (!controller) {
      throw new Error('Controller not found');
    }
    
    if (controller.status === 'offline') {
      throw new Error('Controller is offline');
    }

    const targetZone = controller.zones.find(z => z.id === zone);
    if (!targetZone) {
      throw new Error('Zone not found');
    }

    if (targetZone.isActive) {
      throw new Error('Zone is already active');
    }

    // Simulate starting irrigation
    targetZone.isActive = true;
    targetZone.timeRemaining = duration;
    targetZone.flowRate = Math.round((intensity / 100) * 20); // Max 20 L/min

    // Simulate stopping after duration
    setTimeout(() => {
      targetZone.isActive = false;
      targetZone.timeRemaining = 0;
      targetZone.flowRate = 0;
    }, duration * 60 * 1000);

    return { success: true, message: `Irrigation started for Zone ${zone}` };
  }

  async stopIrrigation(controllerId, zone) {
    const controller = this.irrigationControllers.find(c => c.id === controllerId);
    if (!controller) {
      throw new Error('Controller not found');
    }

    const targetZone = controller.zones.find(z => z.id === zone);
    if (!targetZone) {
      throw new Error('Zone not found');
    }

    targetZone.isActive = false;
    targetZone.timeRemaining = 0;
    targetZone.flowRate = 0;

    return { success: true, message: `Irrigation stopped for Zone ${zone}` };
  }

  // Emergency Actions
  async executeEmergencyAction(actionId) {
    console.log(`Executing emergency action: ${actionId}`);
    
    switch (actionId) {
      case 'stop_all_irrigation':
        this.irrigationControllers.forEach(controller => {
          controller.zones.forEach(zone => {
            zone.isActive = false;
            zone.timeRemaining = 0;
            zone.flowRate = 0;
          });
        });
        break;
        
      case 'disable_automation':
        this.systemActive = false;
        this.rules.forEach(rule => rule.isActive = false);
        break;
        
      case 'emergency_drainage':
        console.log('Emergency drainage systems activated');
        break;
        
      case 'alert_emergency_contacts':
        console.log('Emergency alerts sent to all contacts');
        break;
    }

    return { success: true, message: `Emergency action ${actionId} executed` };
  }

  // Private helper methods
  loadRules() {
    const saved = localStorage.getItem('automationRules');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default rules
    return [
      {
        id: '1',
        name: 'Low Moisture Auto-Irrigation',
        condition: {
          sensor: 'soilMoisture',
          operator: '<',
          value: '30',
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
        isActive: true,
        createdAt: new Date().toISOString(),
        lastTriggered: null,
        triggerCount: 3
      }
    ];
  }

  saveRules() {
    localStorage.setItem('automationRules', JSON.stringify(this.rules));
  }

  getDefaultAlertConfig() {
    const saved = localStorage.getItem('alertConfig');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
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
    };
  }

  getMockControllers() {
    return [
      {
        id: 'ctrl_001',
        name: 'Main Field Controller',
        location: 'Field A - North Section',
        status: 'active',
        waterPressure: 45,
        totalFlowRate: 25,
        dailyUsage: 1250,
        zones: [
          { id: 1, isActive: false, timeRemaining: 0, flowRate: 0 },
          { id: 2, isActive: true, timeRemaining: 12, flowRate: 15 },
          { id: 3, isActive: false, timeRemaining: 0, flowRate: 0 },
          { id: 4, isActive: false, timeRemaining: 0, flowRate: 0 }
        ]
      },
      {
        id: 'ctrl_002',
        name: 'Greenhouse Controller',
        location: 'Greenhouse Complex',
        status: 'idle',
        waterPressure: 38,
        totalFlowRate: 0,
        dailyUsage: 850,
        zones: [
          { id: 1, isActive: false, timeRemaining: 0, flowRate: 0 },
          { id: 2, isActive: false, timeRemaining: 0, flowRate: 0 },
          { id: 3, isActive: false, timeRemaining: 0, flowRate: 0 }
        ]
      },
      {
        id: 'ctrl_003',
        name: 'South Field Controller',
        location: 'Field B - South Section',
        status: 'maintenance',
        waterPressure: 0,
        totalFlowRate: 0,
        dailyUsage: 0,
        zones: [
          { id: 1, isActive: false, timeRemaining: 0, flowRate: 0 },
          { id: 2, isActive: false, timeRemaining: 0, flowRate: 0 }
        ]
      }
    ];
  }
}

// Export singleton instance
export const automationService = new AutomationService();