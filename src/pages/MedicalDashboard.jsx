import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Stethoscope, Activity, Brain, TrendingUp, Heart, Users, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MedicalDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const modules = [
    {
      id: 'diagnosis',
      title: 'AI Diagnosis',
      description: 'Advanced symptom analysis with comprehensive medical insights',
      icon: <Stethoscope className="w-6 h-6" />,
      path: '/medical-diagnosis',
      color: 'teal'
    },
    {
      id: 'vitals',
      title: 'Vitals Monitor',
      description: 'Real-time vital signs monitoring with AI-powered analysis',
      icon: <Activity className="w-6 h-6" />,
      path: '/medical-vitals',
      color: 'red'
    },
    {
      id: 'predictor',
      title: 'Health Predictor',
      description: 'AI-powered health outcome predictions and risk assessment',
      icon: <Brain className="w-6 h-6" />,
      path: '/medical-predictor',
      color: 'purple'
    },
    {
      id: 'trends',
      title: 'Health Analytics',
      description: 'Advanced health trend analysis and population insights',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/medical-analytics',
      color: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-teal-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-teal-400">Medical</span>AI
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span>Dr. {user?.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 drop-shadow-lg">
            {t('pages.medical_dashboard.title1')} <br /> {t('pages.medical_dashboard.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.medical_dashboard.subtitle')}
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-gray-900/50 rounded-3xl p-6 border border-teal-400/30 shadow-xl shadow-teal-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <div className={`bg-${module.color}-400/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-${module.color}-400/20 transition-all duration-300`}>
                <div className={`w-6 h-6 text-${module.color}-400`}>{module.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors duration-300">{module.title}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {module.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">Status</span>
                  <span className="text-teal-400 font-medium text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">AI Model</span>
                  <span className="text-white font-medium text-xs">Advanced</span>
                </div>
              </div>
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 text-sm transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-teal-500/30">
                {t('common.launch')} {module.title}
              </button>
            </div>
          ))}
        </div>

        {/* Healthcare Impact Section */}
        <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-teal-400/30 shadow-2xl shadow-teal-500/10 backdrop-filter backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
              Advancing Healthcare with AI
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Our AI-powered medical platform enhances diagnostic accuracy, improves patient outcomes, 
              and empowers healthcare professionals with cutting-edge technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-teal-400 mb-2">95%</div>
                <div className="text-gray-300">Diagnostic Accuracy</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-teal-400 mb-2">50%</div>
                <div className="text-gray-300">Faster Diagnosis</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-teal-400 mb-2">24/7</div>
                <div className="text-gray-300">AI Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>{t('footer.copy_medical')}</p>
      </div>
    </div>
  )
}

export default MedicalDashboard