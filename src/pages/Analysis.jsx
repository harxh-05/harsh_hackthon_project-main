import { BarChart3, PieChart, LineChart, ArrowLeft, Microscope, Beaker, Leaf, Zap, Cloud, Droplet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Analysis = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const AnalysisCard = ({ icon, title, description, children, extraClasses = '' }) => (
    <div className={`bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] ${extraClasses}`}>
      <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            {t('pages.analysis.title1')} <br /> {t('pages.analysis.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.analysis.subtitle')}
          </p>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <AnalysisCard
            icon={<Microscope className="w-8 h-8 text-green-400" />}
            title="Soil Health"
            description="Detailed soil composition, pH levels, and nutrient analysis using advanced sensors and lab testing."
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">pH Level</span>
                <span className="text-green-400 font-bold text-lg">6.8</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Nitrogen (N)</span>
                <span className="text-green-400 font-bold text-lg">45 ppm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Phosphorus (P)</span>
                <span className="text-green-400 font-bold text-lg">32 ppm</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Potassium (K)</span>
                <span className="text-green-400 font-bold text-lg">28 ppm</span>
              </div>
            </div>
          </AnalysisCard>

          <AnalysisCard
            icon={<Leaf className="w-8 h-8 text-green-400" />}
            title="Crop Vigor"
            description="Real-time monitoring of crop health, disease detection, and growth stage analysis via drone imagery."
          >
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Overall Health</span>
                  <span className="text-green-400 font-bold text-lg">92%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className="bg-green-400 h-3 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Disease Risk</span>
                  <span className="text-yellow-400 font-bold text-lg">Low</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className="bg-yellow-400 h-3 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </AnalysisCard>
          
          <AnalysisCard
            icon={<Beaker className="w-8 h-8 text-green-400" />}
            title="Water Quality"
            description="Irrigation water analysis including mineral content, pH, and contamination levels for optimal usage."
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">pH Level</span>
                <span className="text-green-400 font-bold text-lg">7.2</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">TDS</span>
                <span className="text-green-400 font-bold text-lg">340 ppm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Salinity</span>
                <span className="text-green-400 font-bold text-lg">0.2%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Quality Score</span>
                <span className="text-green-400 font-bold text-lg">A+</span>
              </div>
            </div>
          </AnalysisCard>
        </div>

        {/* Charts & Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <AnalysisCard
            icon={<BarChart3 className="w-8 h-8 text-green-400" />}
            title="Yield Trends"
            description="Track your harvest yield over time and visualize your farm's performance."
          >
            <div className="flex items-end space-x-2 h-32 mb-4">
              {[65, 72, 68, 85, 92, 88, 95].map((height, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group cursor-pointer">
                  <div 
                    className="bg-green-400 rounded-t w-full transition-all duration-500 group-hover:bg-green-300" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-400 group-hover:text-green-400 transition-colors">
                    {['2018', '2019', '2020', '2021', '2022', '2023', '2024'][i]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">Consistent yield improvement over the last 7 years.</p>
          </AnalysisCard>

          <AnalysisCard
            icon={<PieChart className="w-8 h-8 text-green-400" />}
            title="Resource Efficiency"
            description="Get a clear overview of your resource usage and identify areas for optimization."
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Water Efficiency</span>
                </div>
                <span className="font-bold text-lg">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Fertilizer Savings</span>
                </div>
                <span className="font-bold text-lg text-yellow-400">-23%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Energy Consumption</span>
                </div>
                <span className="font-bold text-lg text-green-400">-15%</span>
              </div>
            </div>
          </AnalysisCard>
        </div>

        {/* Actionable Insights Section */}
        <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t('pages.analysis.actionable_insights')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Fertilizer Recommendation</h3>
              <p className="text-gray-400">Apply **30% less** nitrogen this week to avoid over-fertilization and save costs.</p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <Droplet className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Irrigation Alert</h3>
              <p className="text-gray-400">Soil moisture levels are **8% below** optimal. Schedule irrigation for the North sector by 5 PM.</p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <Cloud className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Weather & Pest Forecast</h3>
              <p className="text-gray-400">A storm is approaching. Consider proactive pest control in the next 48 hours to mitigate risk.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>{t('footer.copy')}</p>
      </div>
    </div>
  );
};

export default Analysis;