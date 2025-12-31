import { Brain, BarChart3, TrendingUp, Zap, ArrowLeft, Cpu, Database, Activity, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AIAnalytics = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const GlassCard = ({ icon, title, description, children }) => (
    <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 relative group">
      <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-6 text-white">{title}</h3>
      <p className="text-gray-300 mb-8 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-green-400">AgriFarm</span>AI
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_home')}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            {t('pages.ai_analytics.title1')} <br /> {t('pages.ai_analytics.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('pages.ai_analytics.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <GlassCard
            icon={<Brain className="w-8 h-8 text-green-400 animate-pulse" />}
            title="Predictive Analytics"
            description="Our AI models analyze historical data, weather patterns, and soil conditions to predict optimal planting times and crop yields."
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Accuracy Rate</span>
                <span className="text-green-400 font-bold text-lg">94.2%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-green-400 h-3 rounded-full transition-all duration-1000" style={{ width: '94.2%' }}></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            icon={<Cpu className="w-8 h-8 text-green-400 animate-pulse animation-delay-200" />}
            title="Real-time Processing"
            description="Process thousands of data points per second from IoT sensors, satellites, and weather stations for instant insights."
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Processing Speed</span>
                <span className="text-green-400 font-bold text-lg">2.3ms</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-green-400 h-3 rounded-full transition-all duration-1000" style={{ width: '98%' }}></div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <GlassCard
            icon={<Database className="w-8 h-8 text-green-400" />}
            title="Data Sources"
            description="Integrated data streams."
          >
            <div className="text-6xl font-black text-green-400 mt-4 text-center">50+</div>
          </GlassCard>

          <GlassCard
            icon={<Activity className="w-8 h-8 text-green-400" />}
            title="Models Trained"
            description="AI algorithms deployed."
          >
            <div className="text-6xl font-black text-green-400 mt-4 text-center">127</div>
          </GlassCard>

          <GlassCard
            icon={<TrendingUp className="w-8 h-8 text-green-400" />}
            title="Predictions Daily"
            description="Insights generated."
          >
            <div className="text-6xl font-black text-green-400 mt-4 text-center">10K+</div>
          </GlassCard>
        </div>

        <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t('pages.ai_analytics.capabilities')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-400">Computer Vision</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Crop disease and pest detection from drone imagery</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Growth stage monitoring and yield estimation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Automated weed detection and mapping for targeted spraying</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-400">Predictive Models</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Accurate weather pattern and climate forecasting</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Yield prediction algorithms with 94%+ accuracy</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Resource optimization and profitability analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>© 2024 AgriFarmAI. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AIAnalytics;