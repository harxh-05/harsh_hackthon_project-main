import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SensorCard = ({ sensor, isSelected, onClick, icon, colorClass }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getStatusBadge = (sensor) => {
    let status = 'normal';
    let bgColor = 'bg-green-900/50 text-green-400';
    
    if (sensor.type === 'moisture') {
      if (sensor.value < 30) {
        status = 'low';
        bgColor = 'bg-red-900/50 text-red-400';
      } else if (sensor.value > 70) {
        status = 'high';
        bgColor = 'bg-blue-900/50 text-blue-400';
      }
    } else if (sensor.type === 'temperature') {
      if (sensor.value < 15 || sensor.value > 35) {
        status = 'alert';
        bgColor = 'bg-red-900/50 text-red-400';
      }
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected
          ? 'bg-green-900/30 border-green-400 shadow-lg shadow-green-400/20'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gray-700/50 ${colorClass}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-white">{sensor.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{sensor.type}</p>
          </div>
        </div>
        {getStatusBadge(sensor)}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-white">
            {sensor.value}
            <span className="text-sm text-gray-400 ml-1">{sensor.unit}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon(sensor.trend || 0)}
            <span className="text-xs text-gray-400">
              {Math.abs(sensor.trend || 0).toFixed(1)}% from last hour
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400">Last update</div>
          <div className="text-xs text-white">
            {new Date(sensor.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Mini chart/sparkline placeholder */}
      <div className="mt-3 h-8 bg-gray-700/30 rounded flex items-end justify-between px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-t ${colorClass.replace('text-', 'bg-')} opacity-60`}
            style={{
              height: `${Math.random() * 100}%`,
              minHeight: '2px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SensorCard;