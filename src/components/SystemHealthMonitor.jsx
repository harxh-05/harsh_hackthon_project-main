import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { apiLoadBalancer } from '../services/loadBalancer';
import { connectionPool } from '../services/connectionPool';

const SystemHealthMonitor = () => {
  const [health, setHealth] = useState({
    endpoints: [],
    queueSize: 0,
    activeConnections: 0,
    circuitState: 'CLOSED',
    cacheHits: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth({
        endpoints: apiLoadBalancer.endpoints.map(ep => ({
          url: ep.url.split('/').pop(),
          healthy: ep.healthy
        })),
        queueSize: apiLoadBalancer.requestQueue.length,
        activeConnections: connectionPool.activeConnections,
        circuitState: connectionPool.circuitBreaker.state,
        cacheHits: Math.floor(Math.random() * 100) // Mock cache hits
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 text-white text-xs max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-green-400" />
        <span className="font-semibold">System Health</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Queue:</span>
          <span className={health.queueSize > 5 ? 'text-yellow-400' : 'text-green-400'}>
            {health.queueSize}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Active:</span>
          <span className="text-blue-400">{health.activeConnections}/5</span>
        </div>
        
        <div className="flex justify-between">
          <span>Circuit:</span>
          <span className={`flex items-center gap-1 ${
            health.circuitState === 'CLOSED' ? 'text-green-400' : 
            health.circuitState === 'OPEN' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {health.circuitState === 'CLOSED' ? <CheckCircle className="w-3 h-3" /> : 
             health.circuitState === 'OPEN' ? <AlertTriangle className="w-3 h-3" /> : 
             <Clock className="w-3 h-3" />}
            {health.circuitState}
          </span>
        </div>
        
        <div className="border-t border-gray-700 pt-2">
          <div className="text-gray-400 mb-1">Endpoints:</div>
          {health.endpoints.map((ep, i) => (
            <div key={i} className="flex justify-between">
              <span>{ep.url}</span>
              <span className={ep.healthy ? 'text-green-400' : 'text-red-400'}>
                {ep.healthy ? '●' : '●'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;