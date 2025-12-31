import { TrendingUp, DollarSign, Calendar, ArrowLeft, AlertTriangle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Insights = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Reusable component for the glassmorphic cards
  const GlassCard = ({ children, extraClasses = '' }) => (
    <div className={`bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 relative group ${extraClasses}`}>
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
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
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
            {t('pages.insights.title1')} <br /> {t('pages.insights.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('pages.insights.subtitle')}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <GlassCard extraClasses="text-center">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-green-400 animate-pulse" />
            </div>
            <div className="text-5xl font-black text-green-400 mb-4">+32%</div>
            <p className="text-gray-400 font-medium">Profit Increase</p>
          </GlassCard>

          <GlassCard extraClasses="text-center">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-green-400 animate-pulse animation-delay-200" />
            </div>
            <div className="text-5xl font-black text-green-400 mb-4">$2.4K</div>
            <p className="text-gray-400 font-medium">Revenue/Acre</p>
          </GlassCard>

          <GlassCard extraClasses="text-center">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-green-400 animate-pulse animation-delay-400" />
            </div>
            <div className="text-5xl font-black text-green-400 mb-4">45</div>
            <p className="text-gray-400 font-medium">Days to Harvest</p>
          </GlassCard>

          <GlassCard extraClasses="text-center">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400 animate-pulse animation-delay-600" />
            </div>
            <div className="text-5xl font-black text-green-400 mb-4">98%</div>
            <p className="text-gray-400 font-medium">Crop Health</p>
          </GlassCard>
        </div>

        {/* Alerts & Recommendations and Market Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              {t('pages.insights.active_alerts')}
            </h3>
            <div className="space-y-4">
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-400">Weather Warning</span>
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-300">Heavy rainfall expected in 48 hours. Consider adjusting irrigation schedule.</p>
              </div>
              
              <div className="bg-orange-400/10 border border-orange-400/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-orange-400">Nutrient Alert</span>
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-sm text-gray-300">Nitrogen levels dropping in Field A. Fertilizer application recommended.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{t('pages.insights.market_intelligence')}</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Corn Futures</span>
                  <span className="text-green-400 font-bold flex items-center">
                    +5.2% <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
                <p className="text-sm text-gray-400">$6.45/bushel • Expected to rise 8% by harvest</p>
              </div>

              <div className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Soybean Demand</span>
                  <span className="text-green-400 font-bold">High</span>
                </div>
                <p className="text-sm text-gray-400">$14.20/bushel • Strong export demand from Asia</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Wheat Prices</span>
                  <span className="text-red-400 font-bold">-2.1%</span>
                </div>
                <p className="text-sm text-gray-400">$7.85/bushel • Oversupply expected this season</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <GlassCard extraClasses="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t('pages.insights.ai_recommendations')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">{t('pages.insights.this_week')}</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Apply nitrogen fertilizer to Field A (optimal weather window)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Reduce irrigation by 15% due to upcoming rainfall</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Scout for corn borer in eastern fields</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">{t('pages.insights.next_month')}</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Plan harvest logistics for optimal timing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Prepare storage facilities for increased yield</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Evaluate cover crop options for winter</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* ROI Calculator */}
        <GlassCard>
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t('pages.insights.investment_returns')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 mb-2">$12,500</div>
              <p className="text-gray-400">Total Investment</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 mb-2">$28,750</div>
              <p className="text-gray-400">Projected Revenue</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 mb-2">230%</div>
              <p className="text-gray-400">ROI This Season</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>{t('footer.copy')}</p>
      </div>
    </div>
  );
};

export default Insights;