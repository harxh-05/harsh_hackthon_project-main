import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Brain, AlertTriangle, Target, Activity, Calendar, Loader, TrendingUp } from 'lucide-react'
import { MedicalAI } from '../services/medicalAI'
import { useTranslation } from 'react-i18next'

const MedicalPredictor = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    medicalHistory: '',
    symptoms: '',
    lifestyle: '',
    familyHistory: ''
  })
  const [vitalsHistory, setVitalsHistory] = useState([])
  const [predictions, setPredictions] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzePredictions = async () => {
    if (!patientData.age) return
    
    setLoading(true)
    try {
      const healthPredictions = await MedicalAI.predictHealthOutcomes(patientData, vitalsHistory)
      setPredictions(healthPredictions)
      
      const healthData = {
        patient: patientData,
        vitalsHistory,
        currentSymptoms: patientData.symptoms
      }
      const trendAnalysis = await MedicalAI.analyzeHealthTrends(healthData)
      setTrends(trendAnalysis)
      
    } catch (error) {
      console.error('Prediction analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addVitalRecord = () => {
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      bp: '',
      hr: '',
      temp: ''
    }
    setVitalsHistory([...vitalsHistory, newRecord])
  }

  const updateVitalRecord = (index, field, value) => {
    const updated = [...vitalsHistory]
    updated[index][field] = value
    setVitalsHistory(updated)
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-purple-400">Health</span>Predictor
          </div>
          <button 
            onClick={() => navigate('/medical-dashboard')}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_dashboard')}</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 drop-shadow-lg">
            {t('pages.medical_predictor.title1')} <br /> {t('pages.medical_predictor.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.medical_predictor.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Patient Data */}
            <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
              <div className="bg-purple-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-6">{t('pages.medical_predictor.patient_information')}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={patientData.age}
                    onChange={(e) => setPatientData(prev => ({...prev, age: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={patientData.gender}
                    onChange={(e) => setPatientData(prev => ({...prev, gender: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Medical History</label>
                  <textarea
                    placeholder="Medical History (diabetes, hypertension, etc.)"
                    value={patientData.medicalHistory}
                    onChange={(e) => setPatientData(prev => ({...prev, medicalHistory: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Symptoms</label>
                  <textarea
                    placeholder="Current Symptoms"
                    value={patientData.symptoms}
                    onChange={(e) => setPatientData(prev => ({...prev, symptoms: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lifestyle</label>
                  <input
                    type="text"
                    placeholder="Lifestyle (exercise, diet, smoking, etc.)"
                    value={patientData.lifestyle}
                    onChange={(e) => setPatientData(prev => ({...prev, lifestyle: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Family History</label>
                  <input
                    type="text"
                    placeholder="Family History"
                    value={patientData.familyHistory}
                    onChange={(e) => setPatientData(prev => ({...prev, familyHistory: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Vitals History */}
            <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-red-400" />
                  Vitals History
                </h3>
                <button
                  onClick={addVitalRecord}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                >
                  Add Record
                </button>
              </div>
              
              <div className="space-y-3">
                {vitalsHistory.map((record, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <input
                      type="date"
                      value={record.date}
                      onChange={(e) => updateVitalRecord(index, 'date', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="BP (120/80)"
                      value={record.bp}
                      onChange={(e) => updateVitalRecord(index, 'bp', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="HR (bpm)"
                      value={record.hr}
                      onChange={(e) => updateVitalRecord(index, 'hr', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Temp (°F)"
                      value={record.temp}
                      onChange={(e) => updateVitalRecord(index, 'temp', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={analyzePredictions}
              disabled={loading || !patientData.age}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Predict Health Outcomes
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm text-center">
                <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-purple-400 font-medium">Analyzing health data and generating predictions...</p>
              </div>
            )}

            {/* Risk Assessment */}
            {predictions && !loading && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
                <div className="bg-purple-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-6">Risk Assessment</h2>
                
                <div className="space-y-4">
                  {predictions.riskAssessment && Object.entries(predictions.riskAssessment).map(([condition, data]) => (
                    <div key={condition} className={`p-6 rounded-xl border ${getRiskColor(data.risk)}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold capitalize">{condition}</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium">
                          {data.risk} Risk
                        </span>
                      </div>
                      {data.factors && (
                        <div className="text-sm mb-2">
                          <strong>Risk Factors:</strong> {data.factors.join(', ')}
                        </div>
                      )}
                      {data.timeline && (
                        <div className="text-sm">
                          <strong>Timeline:</strong> {data.timeline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Trajectory */}
            {predictions && predictions.healthTrajectory && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
                <div className="bg-purple-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-6">Health Trajectory</h2>
                
                <div className="space-y-4">
                  <div className="p-6 bg-blue-400/10 rounded-xl border border-blue-400/30">
                    <h3 className="font-semibold text-blue-400 mb-2">Short Term (1-3 months)</h3>
                    <p className="text-gray-300">{predictions.healthTrajectory.shortTerm}</p>
                  </div>
                  
                  <div className="p-6 bg-green-400/10 rounded-xl border border-green-400/30">
                    <h3 className="font-semibold text-green-400 mb-2">Medium Term (6-12 months)</h3>
                    <p className="text-gray-300">{predictions.healthTrajectory.mediumTerm}</p>
                  </div>
                  
                  <div className="p-6 bg-purple-400/10 rounded-xl border border-purple-400/30">
                    <h3 className="font-semibold text-purple-400 mb-2">Long Term (1-5 years)</h3>
                    <p className="text-gray-300">{predictions.healthTrajectory.longTerm}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trend Analysis */}
            {trends && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
                <div className="bg-purple-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-6">Health Trends</h2>
                
                {trends.trendAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-400">{trends.trendAnalysis.vitals?.direction}</div>
                      <div className="text-sm text-gray-300">Vitals Trend</div>
                      <div className="text-xs text-gray-500">{trends.trendAnalysis.vitals?.confidence} confidence</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-green-400">{trends.trendAnalysis.symptoms?.progression}</div>
                      <div className="text-sm text-gray-300">Symptoms</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-400">{trends.trendAnalysis.overall?.health}</div>
                      <div className="text-sm text-gray-300">Overall Health</div>
                    </div>
                  </div>
                )}

                {trends.predictions && (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
                      <strong className="text-yellow-400">Next Week:</strong>
                      <span className="text-gray-300 ml-2">{trends.predictions.nextWeek}</span>
                    </div>
                    
                    <div className="p-4 bg-blue-400/10 rounded-xl border border-blue-400/30">
                      <strong className="text-blue-400">Next Month:</strong>
                      <span className="text-gray-300 ml-2">{trends.predictions.nextMonth}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {predictions && predictions.interventions && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm">
                <div className="bg-purple-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-6">Recommendations</h2>
                
                <div className="space-y-4">
                  {predictions.interventions.preventive && (
                    <div className="p-6 bg-green-400/10 rounded-xl border border-green-400/30">
                      <h3 className="font-semibold text-green-400 mb-3">Preventive Measures</h3>
                      <ul className="list-disc ml-5 text-gray-300">
                        {predictions.interventions.preventive.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {predictions.interventions.lifestyle && (
                    <div className="p-6 bg-blue-400/10 rounded-xl border border-blue-400/30">
                      <h3 className="font-semibold text-blue-400 mb-3">Lifestyle Changes</h3>
                      <ul className="list-disc ml-5 text-gray-300">
                        {predictions.interventions.lifestyle.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!predictions && !loading && (
              <div className="bg-gray-900/50 rounded-[40px] p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 backdrop-filter backdrop-blur-sm text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300">Enter patient information to generate health predictions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalPredictor