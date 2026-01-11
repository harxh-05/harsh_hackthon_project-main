// Real-time service for IoT sensor data
class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.connectionListeners = new Set();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.mockInterval = null;
  }

  connect() {
    // For demo purposes, we'll simulate real-time data
    // In production, replace with actual WebSocket/Firebase connection
    this.simulateConnection();
  }

  simulateConnection() {
    this.isConnected = true;
    this.notifyConnectionChange(true);
    
    // Generate mock sensor data every 2 seconds
    this.mockInterval = setInterval(() => {
      this.generateMockSensorData();
    }, 2000);

    // Initial sensor data
    this.initializeMockSensors();
  }

  initializeMockSensors() {
    const mockSensors = [
      {
        id: 'sensor_001',
        name: 'Field A - North',
        type: 'moisture',
        value: 45,
        unit: '%',
        timestamp: Date.now(),
        location: { lat: 28.6139, lng: 77.2090 },
        trend: 2.1
      },
      {
        id: 'sensor_002',
        name: 'Field A - Center',
        type: 'temperature',
        value: 24,
        unit: '°C',
        timestamp: Date.now(),
        location: { lat: 28.6149, lng: 77.2100 },
        trend: -0.5
      },
      {
        id: 'sensor_003',
        name: 'Field A - South',
        type: 'ph',
        value: 6.8,
        unit: 'pH',
        timestamp: Date.now(),
        location: { lat: 28.6129, lng: 77.2080 },
        trend: 0.2
      },
      {
        id: 'sensor_004',
        name: 'Field B - East',
        type: 'moisture',
        value: 28,
        unit: '%',
        timestamp: Date.now(),
        location: { lat: 28.6159, lng: 77.2110 },
        trend: -3.2
      },
      {
        id: 'sensor_005',
        name: 'Field B - West',
        type: 'temperature',
        value: 32,
        unit: '°C',
        timestamp: Date.now(),
        location: { lat: 28.6119, lng: 77.2070 },
        trend: 1.8
      }
    ];

    mockSensors.forEach(sensor => {
      this.notifySensorUpdate(sensor);
    });
  }

  generateMockSensorData() {
    const sensorIds = ['sensor_001', 'sensor_002', 'sensor_003', 'sensor_004', 'sensor_005'];
    const randomSensorId = sensorIds[Math.floor(Math.random() * sensorIds.length)];
    
    // Get existing sensor data or create new
    const updates = this.createSensorUpdate(randomSensorId);
    this.notifySensorUpdate(updates);
  }

  createSensorUpdate(sensorId) {
    const sensorConfigs = {
      'sensor_001': { type: 'moisture', baseValue: 45, range: 10 },
      'sensor_002': { type: 'temperature', baseValue: 24, range: 5 },
      'sensor_003': { type: 'ph', baseValue: 6.8, range: 0.5 },
      'sensor_004': { type: 'moisture', baseValue: 28, range: 8 },
      'sensor_005': { type: 'temperature', baseValue: 32, range: 4 }
    };

    const config = sensorConfigs[sensorId];
    const variation = (Math.random() - 0.5) * config.range;
    const newValue = Math.max(0, config.baseValue + variation);
    
    return {
      id: sensorId,
      value: parseFloat(newValue.toFixed(1)),
      timestamp: Date.now(),
      trend: variation
    };
  }

  onSensorUpdate(callback) {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);
    
    return () => {
      this.listeners.delete(id);
    };
  }

  onConnectionChange(callback) {
    this.connectionListeners.add(callback);
    // Immediately call with current status
    callback(this.isConnected);
    
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  notifySensorUpdate(sensorData) {
    this.listeners.forEach(callback => {
      try {
        callback(sensorData);
      } catch (error) {
        console.error('Error in sensor update callback:', error);
      }
    });
  }

  notifyConnectionChange(connected) {
    this.isConnected = connected;
    this.connectionListeners.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection change callback:', error);
      }
    });
  }

  disconnect() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    
    this.isConnected = false;
    this.notifyConnectionChange(false);
    this.listeners.clear();
    this.connectionListeners.clear();
  }

  // Method to send commands to IoT devices (for future automation)
  sendCommand(deviceId, command, parameters = {}) {
    console.log(`Sending command to ${deviceId}:`, command, parameters);
    
    // Simulate command execution
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          deviceId,
          command,
          timestamp: Date.now(),
          response: 'Command executed successfully'
        });
      }, 1000);
    });
  }

  // Method to get historical sensor data
  getHistoricalData(sensorId, timeRange = '24h') {
    // Mock historical data
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 1;
    const data = [];
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = Date.now() - (i * 60 * 60 * 1000);
      data.push({
        timestamp,
        value: Math.random() * 50 + 20, // Random value between 20-70
        sensorId
      });
    }
    
    return Promise.resolve(data);
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// For Firebase integration (uncomment and configure when ready):
/*
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class FirebaseRealtimeService extends RealtimeService {
  connect() {
    const sensorsRef = ref(database, 'sensors');
    
    this.firebaseListener = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach(sensor => {
          this.notifySensorUpdate(sensor);
        });
      }
    });
    
    this.notifyConnectionChange(true);
  }
  
  disconnect() {
    if (this.firebaseListener) {
      off(ref(database, 'sensors'), this.firebaseListener);
    }
    super.disconnect();
  }
}
*/