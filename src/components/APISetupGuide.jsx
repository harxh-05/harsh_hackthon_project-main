import React, { useState, useEffect } from 'react';
import { AlertTriangle, Key } from 'lucide-react';

const APISetupGuide = () => {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const alphaVantageKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    
    if (!openrouterKey || openrouterKey === 'your_openrouter_api_key_here' ||
        !alphaVantageKey || alphaVantageKey === 'your_alpha_vantage_api_key_here') {
      setShowGuide(true);
    }
  }, []);

  if (!showGuide) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-900/90 backdrop-blur-lg rounded-lg p-4 max-w-md border border-yellow-600">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-400 mt-1" size={20} />
        <div className="flex-1">
          <h3 className="text-yellow-100 font-semibold mb-2">API Keys Required</h3>
          <p className="text-yellow-200 text-sm mb-3">
            Configure API keys in .env file for full functionality:
          </p>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-yellow-400" />
              <span className="text-yellow-200">OpenRouter API (AI Models)</span>
            </div>
            <div className="flex items-center gap-2">
              <Key size={14} className="text-yellow-400" />
              <span className="text-yellow-200">Alpha Vantage (Market Data)</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowGuide(false)}
            className="mt-3 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default APISetupGuide;