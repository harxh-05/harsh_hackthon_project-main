import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Beaker, Camera, Satellite, TrendingUp, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SustainableFarmingTool = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const modules = [
    {
      id: 'crop',
      title: t('pages.farming_tool.modules.crop.title'),
      description: t('pages.farming_tool.modules.crop.desc'),
      icon: <Camera className="w-6 h-6" />,
      path: '/crop-health'
    },
    {
      id: 'soil',
      title: t('pages.farming_tool.modules.soil.title'),
      description: t('pages.farming_tool.modules.soil.desc'),
      icon: <Beaker className="w-6 h-6" />,
      path: '/soil-analysis'
    },
    {
      id: 'monitoring',
      title: t('pages.farming_tool.modules.monitoring.title'),
      description: t('pages.farming_tool.modules.monitoring.desc'),
      icon: <Satellite className="w-6 h-6" />,
      path: '/monitoring'
    },
    {
      id: 'market',
      title: t('pages.farming_tool.modules.market.title'),
      description: t('pages.farming_tool.modules.market.desc'),
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/market-intel'
    },
    {
      id: 'geo-soil',
      title: 'Geo Soil Analysis',
      description: 'Location-based soil data analysis with nearby field insights within 1km range',
      icon: <MapPin className="w-6 h-6" />,
      path: '/geo-soil-analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            {t('pages.farming_tool.title1')} <br /> {t('pages.farming_tool.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.farming_tool.subtitle')}
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modules.slice(0, 4).map((module) => (
            <div
              key={module.id}
              className="bg-gray-900/50 rounded-3xl p-6 border border-green-400/30 shadow-xl shadow-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <div className="bg-green-400/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-400/20 transition-all duration-300">
                <div className="w-6 h-6 text-green-400">{module.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors duration-300">{module.title}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {module.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">Status</span>
                  <span className="text-green-400 font-medium text-xs">Ready</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">Analysis</span>
                  <span className="text-white font-medium text-xs">Real-time</span>
                </div>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-4 py-2 text-sm transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-green-500/30">
                Launch {module.title}
              </button>
            </div>
          ))}
        </div>
        
        {/* Additional Module */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 justify-center">
          {modules.slice(4).map((module) => (

            <div
              key={module.id}
              className="bg-gray-900/50 rounded-3xl p-6 border border-green-400/30 shadow-xl shadow-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <div className="bg-green-400/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-400/20 transition-all duration-300">
                <div className="w-6 h-6 text-green-400">{module.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors duration-300">{module.title}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {module.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">{t('pages.farming_tool.card.status_label')}</span>
                  <span className="text-green-400 font-medium text-xs">{t('pages.farming_tool.card.ready')}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400 text-xs">{t('pages.farming_tool.card.analysis_label')}</span>
                  <span className="text-white font-medium text-xs">{t('pages.farming_tool.card.analysis_realtime')}</span>
                </div>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-4 py-2 text-sm transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-green-500/30">
                Launch {module.title}
              </button>
            </div>
          ))}
        </div>

        {/* SDG Impact Section */}
        <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              {t('pages.farming_tool.our_contribution')}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Our AI-powered platform directly addresses global hunger by increasing agricultural productivity, 
              improving food security, and empowering farmers with technology-driven solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-green-400 mb-2">25%</div>
                <div className="text-gray-300">Increase in Crop Yield</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-green-400 mb-2">40%</div>
                <div className="text-gray-300">Reduction in Resource Waste</div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-green-400 mb-2">60%</div>
                <div className="text-gray-300">Improvement in Farm Income</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>{t('footer.copy')}</p>
      </div>
    </div>
  );
};

export default SustainableFarmingTool;