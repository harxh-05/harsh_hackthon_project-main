import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity, AlertTriangle, Heart, Brain, Stethoscope } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MedicalAnalytics = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalPatients: 1247,
    activeCases: 89,
    criticalAlerts: 12,
    recoveryRate: 94.2
  })

  const [recentDiagnoses] = useState([
    { id: 1, condition: 'Hypertension', severity: 'Medium', date: '2024-01-15', status: 'Monitoring' },
    { id: 2, condition: 'Diabetes Type 2', severity: 'High', date: '2024-01-14', status: 'Treatment' },
    { id: 3, condition: 'Respiratory Infection', severity: 'Low', date: '2024-01-13', status: 'Recovered' },
    { id: 4, condition: 'Cardiac Arrhythmia', severity: 'High', date: '2024-01-12', status: 'Critical' },
    { id: 5, condition: 'Migraine', severity: 'Low', date: '2024-01-11', status: 'Treated' }
  ])

  const diseaseData = [
    { name: 'Hypertension', cases: 156, trend: '+12%', color: 'text-red-400' },
    { name: 'Diabetes', cases: 134, trend: '+8%', color: 'text-orange-400' },
    { name: 'Respiratory', cases: 98, trend: '-5%', color: 'text-blue-400' },
    { name: 'Cardiac', cases: 87, trend: '+15%', color: 'text-purple-400' },
    { name: 'Neurological', cases: 76, trend: '+3%', color: 'text-green-400' },
    { name: 'Others', cases: 234, trend: '+7%', color: 'text-yellow-400' }
  ]

  const weeklyData = [
    { day: 'Mon', diagnoses: 23, vitals: 45, predictions: 12 },
    { day: 'Tue', date: '14', diagnoses: 31, vitals: 52, predictions: 18 },
    { day: 'Wed', diagnoses: 28, vitals: 48, predictions: 15 },
    { day: 'Thu', diagnoses: 35, vitals: 61, predictions: 22 },
    { day: 'Fri', diagnoses: 29, vitals: 55, predictions: 19 },
    { day: 'Sat', diagnoses: 18, vitals: 34, predictions: 8 },
    { day: 'Sun', diagnoses: 15, vitals: 28, predictions: 6 }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 'Medium': return 'bg-orange-400/20 text-orange-400 border-orange-400/30'
      case 'Low': return 'bg-green-400/20 text-green-400 border-green-400/30'
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'bg-red-400/20 text-red-400'
      case 'Treatment': return 'bg-orange-400/20 text-orange-400'
      case 'Monitoring': return 'bg-blue-400/20 text-blue-400'
      case 'Treated': return 'bg-green-400/20 text-green-400'
      case 'Recovered': return 'bg-green-400/20 text-green-400'
      default: return 'bg-gray-400/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-blue-400">Medical</span>Analytics
          </div>
          <button 
            onClick={() => navigate('/medical-dashboard')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_dashboard')}</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-lg">
            {t('pages.medical_analytics.title1')} <br /> {t('pages.medical_analytics.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.medical_analytics.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-900/50 rounded-3xl p-8 border border-blue-400/30 shadow-xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-white">{stats.totalPatients.toLocaleString()}</p>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  +15% this month
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-3xl p-8 border border-orange-400/30 shadow-xl shadow-orange-500/10 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Cases</p>
                <p className="text-3xl font-bold text-white">{stats.activeCases}</p>
                <p className="text-sm text-orange-400 flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4" />
                  Monitoring
                </p>
              </div>
              <Stethoscope className="w-12 h-12 text-orange-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-3xl p-8 border border-red-400/30 shadow-xl shadow-red-500/10 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Critical Alerts</p>
                <p className="text-3xl font-bold text-white">{stats.criticalAlerts}</p>
                <p className="text-sm text-red-400 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-3xl p-8 border border-green-400/30 shadow-xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Recovery Rate</p>
                <p className="text-3xl font-bold text-white">{stats.recoveryRate}%</p>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-2">
                  <Heart className="w-4 h-4" />
                  Excellent outcome
                </p>
              </div>
              <Heart className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Weekly Activity Chart */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-blue-400/30 shadow-2xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-blue-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6">Weekly Medical Activity</h3>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div className="font-medium text-white">{day.day}</div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                      <span className="text-gray-300">Diagnoses: {day.diagnoses}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300">Vitals: {day.vitals}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Predictions: {day.predictions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disease Distribution */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-blue-400/30 shadow-2xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-blue-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6">Disease Distribution</h3>
            
            <div className="space-y-4">
              {diseaseData.map((disease, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${disease.color.replace('text-', 'bg-')}`}></div>
                    <span className="font-medium text-white">{disease.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300">{disease.cases} cases</span>
                    <span className={`text-sm font-medium ${disease.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {disease.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Diagnoses */}
        <div className="bg-gray-900/50 rounded-[40px] p-8 border border-blue-400/30 shadow-2xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
          <div className="bg-blue-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-6">Recent Medical Cases</h3>
          
          <div className="space-y-4">
            {recentDiagnoses.map((diagnosis) => (
              <div key={diagnosis.id} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-white">{diagnosis.condition}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(diagnosis.severity)}`}>
                        {diagnosis.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnosis.status)}`}>
                        {diagnosis.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Date: {diagnosis.date}</span>
                      <span>Case ID: #{diagnosis.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-16 bg-gray-900/50 rounded-[40px] p-8 border border-blue-400/30 shadow-2xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              AI-Powered Medical Insights
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Our advanced analytics platform processes thousands of medical data points to provide 
              actionable insights for improved patient outcomes and healthcare efficiency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">95.8%</div>
                <div className="text-gray-300">Diagnostic Accuracy</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">2.3s</div>
                <div className="text-gray-300">Average Analysis Time</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-300">Continuous Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalAnalytics