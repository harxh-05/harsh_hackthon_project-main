import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Activity, Heart, Thermometer, Droplets, AlertTriangle, TrendingUp, Loader } from 'lucide-react'
import { MedicalAI } from '../services/medicalAI'
import { useTranslation } from 'react-i18next'

const MedicalVitals = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  })
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const analyzeVitals = async () => {
    if (!vitals.bloodPressure && !vitals.heartRate) return
    
    setLoading(true)
    try {
      const result = await MedicalAI.analyzeVitals(vitals)
      setAnalysis(result)
      
      const newEntry = {
        timestamp: new Date(),
        vitals: {...vitals},
        analysis: result
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Vitals analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVitalStatus = (vital, value) => {
    if (!value) return 'text-gray-400'
    
    switch (vital) {
      case 'heartRate':
        const hr = parseInt(value)
        if (hr < 60 || hr > 100) return 'text-red-400'
        return 'text-green-400'
      case 'temperature':
        const temp = parseFloat(value)
        if (temp < 97 || temp > 99.5) return 'text-red-400'
        return 'text-green-400'
      case 'oxygenSaturation':
        const spo2 = parseInt(value)
        if (spo2 < 95) return 'text-red-400'
        return 'text-green-400'
      default:
        return 'text-teal-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-red-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-red-400">Vitals</span>Monitor
          </div>
          <button 
            onClick={() => navigate('/medical-dashboard')}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_dashboard')}</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-lg">
            {t('pages.medical_vitals.title1')} <br /> {t('pages.medical_vitals.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.medical_vitals.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-red-400/30 shadow-2xl shadow-red-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-red-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-6">{t('pages.medical_vitals.enter_vital_signs')}</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Blood Pressure</label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                    placeholder="72"
                    className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 ${getVitalStatus('heartRate', vitals.heartRate)}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Temperature (°F)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 ${getVitalStatus('temperature', vitals.temperature)}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Oxygen Saturation (%)</label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="number"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${getVitalStatus('oxygenSaturation', vitals.oxygenSaturation)}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Respiratory Rate (breaths/min)</label>
                <input
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => setVitals(prev => ({...prev, respiratoryRate: e.target.value}))}
                  placeholder="16"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={analyzeVitals}
                disabled={loading || (!vitals.bloodPressure && !vitals.heartRate)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {t('common.analyzing')}
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    {t('pages.medical_vitals.title2')} {t('common.analyze')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-red-400/30 shadow-2xl shadow-red-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-red-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-6">{t('pages.medical_vitals.ai_analysis')}</h2>
            
            {loading && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
                <p className="text-red-400 font-medium">Analyzing vitals...</p>
              </div>
            )}

            {analysis && !loading && (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className={`p-6 rounded-xl border-2 ${
                  analysis.overallStatus === 'critical' ? 'border-red-500 bg-red-500/10' :
                  analysis.overallStatus === 'concerning' ? 'border-yellow-500 bg-yellow-500/10' :
                  'border-green-500 bg-green-500/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {analysis.overallStatus === 'critical' ? <AlertTriangle className="w-6 h-6 text-red-500" /> :
                     analysis.overallStatus === 'concerning' ? <AlertTriangle className="w-6 h-6 text-yellow-500" /> :
                     <Activity className="w-6 h-6 text-green-500" />}
                    <span className="text-xl font-bold capitalize">{analysis.overallStatus} Status</span>
                  </div>
                </div>

                {/* Vitals Analysis */}
                {analysis.vitalsAnalysis && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(analysis.vitalsAnalysis).map(([vital, data]) => (
                        <div key={vital} className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white capitalize">{vital.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              data.status === 'normal' ? 'bg-green-400/20 text-green-400' :
                              data.status === 'high' || data.status === 'low' ? 'bg-red-400/20 text-red-400' :
                              'bg-yellow-400/20 text-yellow-400'
                            }`}>
                              {data.status}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{data.risk || data.concern || data.action || data.urgency}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {analysis.alerts && analysis.alerts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Alerts</h3>
                    <div className="space-y-3">
                      {analysis.alerts.map((alert, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${
                          alert.severity === 'high' ? 'border-red-400/30 bg-red-400/10' :
                          alert.severity === 'medium' ? 'border-yellow-400/30 bg-yellow-400/10' :
                          'border-blue-400/30 bg-blue-400/10'
                        }`}>
                          <div className="font-medium text-white mb-1">{alert.type}</div>
                          <div className="text-sm text-gray-300 mb-2">{alert.message}</div>
                          {alert.action && (
                            <div className="text-sm font-medium text-red-400">Action: {alert.action}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {analysis.recommendations.immediate && (
                        <div className="p-4 bg-red-400/10 rounded-xl border border-red-400/30">
                          <h4 className="font-medium text-red-400 mb-2">Immediate Actions</h4>
                          <ul className="space-y-1">
                            {analysis.recommendations.immediate.map((rec, index) => (
                              <li key={index} className="text-gray-300 text-sm">• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.recommendations.monitoring && (
                        <div className="p-4 bg-blue-400/10 rounded-xl border border-blue-400/30">
                          <h4 className="font-medium text-blue-400 mb-2">Monitoring</h4>
                          <ul className="space-y-1">
                            {analysis.recommendations.monitoring.map((rec, index) => (
                              <li key={index} className="text-gray-300 text-sm">• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!analysis && !loading && (
              <div className="text-center py-16 text-red-600">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">{t('pages.medical_vitals.enter_vitals_cta')}</p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 bg-gray-900/50 rounded-[40px] p-8 border border-red-400/30 shadow-2xl shadow-red-500/10 backdrop-filter backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6">{t('common.recent_readings')}</h2>
            <div className="space-y-4">
              {history.slice(0, 5).map((entry, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {entry.timestamp.toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.analysis.overallStatus === 'critical' ? 'bg-red-400/20 text-red-400' :
                      entry.analysis.overallStatus === 'concerning' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-green-400/20 text-green-400'
                    }`}>
                      {entry.analysis.overallStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>BP: {entry.vitals.bloodPressure}</div>
                    <div>HR: {entry.vitals.heartRate}</div>
                    <div>Temp: {entry.vitals.temperature}°F</div>
                    <div>SpO2: {entry.vitals.oxygenSaturation}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicalVitals