import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import { apiLoadBalancer } from '../services/loadBalancer';
import { connectionPool } from '../services/connectionPool';
import { requestThrottler } from '../services/requestThrottler';

const SystemHealthMonitor = () => {
  const [health, setHealth] = useState({
    endpoints: [],
    queueSize: 0,
    activeConnections: 0,
    circuitState: 'CLOSED',
    cacheHits: 0,
    avgResponseTime: 0,
    throttlingStats: {}
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const lbStats = apiLoadBalancer.getStats();
      const throttleStats = requestThrottler.getStats();
      
      setHealth({
        endpoints: apiLoadBalancer.endpoints.map(ep => ({
          url: ep.url.split('/').pop(),
          healthy: ep.healthy,
          responseTime: ep.responseTime,
          failures: ep.failures,
          weight: ep.weight
        })),
        queueSize: apiLoadBalancer.requestQueue.length,
        activeConnections: connectionPool.activeConnections,
        circuitState: connectionPool.circuitBreaker.state,
        avgResponseTime: lbStats.averageResponseTime || 0,
        throttlingStats: throttleStats
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'CLOSED' || status === true) return 'text-green-400';
    if (status === 'OPEN' || status === false) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 text-white text-xs max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-green-400" />
        <span className="font-semibold">System Health</span>
        <div className={`w-2 h-2 rounded-full ${
          health.circuitState === 'CLOSED' && health.queueSize < 10 ? 'bg-green-400' : 
          health.queueSize > 20 ? 'bg-red-400' : 'bg-yellow-400'
        }`}></div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Queue:</span>
          <span className={health.queueSize > 10 ? 'text-yellow-400' : 'text-green-400'}>
            {health.queueSize}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Active:</span>
          <span className="text-blue-400">{health.activeConnections}/5</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg RT:</span>
          <span className={health.avgResponseTime > 2000 ? 'text-red-400' : 'text-green-400'}>
            {Math.round(health.avgResponseTime)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Circuit:</span>
          <span className={`flex items-center gap-1 ${getStatusColor(health.circuitState)}`}>
            {health.circuitState === 'CLOSED' ? <CheckCircle className="w-3 h-3" /> : 
             health.circuitState === 'OPEN' ? <AlertTriangle className="w-3 h-3" /> : 
             <Clock className="w-3 h-3" />}
            {health.circuitState}
          </span>
        </div>
        
        <div className="border-t border-gray-700 pt-2">
          <div className="text-gray-400 mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Endpoints:
          </div>
          {health.endpoints.map((ep, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="truncate">{ep.url}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{ep.responseTime}ms</span>
                <span className={ep.healthy ? 'text-green-400' : 'text-red-400'}>
                  ●
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {Object.keys(health.throttlingStats).length > 0 && (
          <div className="border-t border-gray-700 pt-2">
            <div className="text-gray-400 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Throttling:
            </div>
            {Object.entries(health.throttlingStats).map(([endpoint, stats]) => (
              <div key={endpoint} className="flex justify-between">
                <span className="truncate">{endpoint.split('/').pop()}</span>
                <span className={stats.utilizationPercent > 80 ? 'text-red-400' : 'text-green-400'}>
                  {Math.round(stats.utilizationPercent)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthMonitor;