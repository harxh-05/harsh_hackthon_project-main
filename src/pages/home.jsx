import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Cloud, Droplet, Wind, Thermometer, TrendingUp, Cpu, Wrench, Menu, X, ArrowUpRight, Stethoscope, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Reusable component for the glassmorphic cards
  const GlassCard = ({ children, extraClasses = '' }) => (
    <div className={`bg-gray-900/50 rounded-[40px] p-6 md:p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 relative group ${extraClasses}`}>
      {children}
    </div>
  );

  const images = [
    'https://img.freepik.com/premium-photo/generative-ai-plant-growing-from-circuit-board-ecology-environment-conceptx9xa_93150-32770.jpg',
    'https://img.freepik.com/premium-photo/generative-ai-plant-growing-from-circuit-board-ecology-environment-conceptx9xa_93150-32770.jpg'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* SVG Clip Path Definitions */}
      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id="home-clip-1">
            <path d="M 87.26477090413202,0 C 84.32855514545265,29.64130419798463 75.22636960464351,36.11933702559631 53.41017687861051,53.4101768786105 C 31.5939841525775,70.70101673162469 25.24043055518949,70.62801729617252 4.235034336112663e-15,69.16335941205675 C -25.240430555189484,67.69870152794098 -25.107358262274794,64.84238519516163 -47.55154534214744,47.55154534214745 C -69.9957324220201,30.260705489133265 -89.8118646540933,23.740656336471023 -89.7767483194906,1.0994480746732168e-14 C -89.74163198488789,-23.740656336471 -69.85526708360925,-24.362986870098208 -47.41108000373661,-47.41108000373659 C -24.966892923863963,-70.45917313737498 -28.14152997926617,-87.75638255715567 -1.69354640895362e-14,-92.19237253455353 C 28.141529979266135,-96.62836251195138 43.33884718729499,-88.2031330469664 65.155039913328,-65.15503991332803 C 86.971232639361,-42.10694677968964 90.20098666281139,-29.64130419798463 87.26477090413202,0 Z" transform="translate(100,100) scale(1.2)"/>
          </clipPath>
          <clipPath id="home-clip-2">
            <path d="M 90.41930202801184,0 C 93.85215248243583,24.820300467002017 79.11112734985495,37.67003976597313 56.50630184285199,56.50630184285198 C 33.901476335849026,75.34256391973084 25.417819876395367,78.18037935254603 4.6135536120700715e-15,75.3450483075154 C -25.41781987639536,72.50971726248477 -22.588170246479102,64.00123973960831 -45.164977662729456,45.16497766272946 C -67.7417850789798,26.328715585850617 -87.46238766578418,25.427330830581976 -90.30722966500142,1.1059445974910889e-14 C -93.15207166421865,-25.427330830581955 -79.12115307584877,-33.64564130580342 -56.54434565959841,-56.5443456595984 C -33.96753824334806,-79.44305001339337 -24.82981142118864,-95.03717882379046 -1.682569499489794e-14,-91.59481741517988 C 24.829811421188605,-88.1524560065693 20.170074518153108,-65.67360437895105 42.77490002515607,-42.774900025156086 C 65.37972553215903,-19.876195671361117 86.98645157358786,-24.820300467002017 90.41930202801184,0 Z" transform="translate(100,100) scale(1.2)"/>
          </clipPath>
        </defs>
      </svg>
      

      
      {/* Enhanced Background Effects & Decorative Elements */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-repeat bg-center opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Cpath d='M0 0h1v20H0V0zm2 0h1v20H2V0zm2 0h1v20H4V0zm2 0h1v20H6V0zm2 0h1v20H8V0zm2 0h1v20h-1V0zm2 0h1v20h-1V0zm2 0h1v20h-1V0zm2 0h1v20h-1V0zm2 0h1v20h-1V0zM0 0h20v1H0V0zM0 2h20v1H0V2zM0 4h20v1H0V4zM0 6h20v1H0V6zM0 8h20v1H0V8zM0 10h20v1H0V10zM0 12h20v1H0V12zM0 14h20v1H0V14zM0 16h20v1H0V16zM0 18h20v1H0V18z'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
        
        {/* Decorative SVG Shapes */}
        <div
          className="absolute top-20 right-10 w-80 h-80 opacity-10 transition-all duration-700 transform hover:scale-110"
          style={{
            clipPath: 'url(#home-clip-1)',
            backgroundImage: `url('${images[0]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div
          className="absolute bottom-20 left-10 w-96 h-96 opacity-8 transition-all duration-700 transform hover:scale-110"
          style={{
            clipPath: 'url(#home-clip-2)',
            backgroundImage: `url('${images[1]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        

        

      </div>
      
      {/* Navbar */}
      <nav className="relative z-20 w-full px-4 sm:px-6 py-4 bg-black/80 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-green-400">AgriFarm</span>AI 
          </div>
          
          {/* Desktop Menu */}
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="bg-white/10 rounded-full px-4 py-2 border border-white/20 shadow-lg space-x-4 lg:space-x-8">
              <button onClick={() => navigate('/')} className="text-green-400 transition-colors duration-300 text-sm lg:text-base font-medium">{t('nav.home')}</button>
              <button onClick={() => navigate('/about')} className="hover:text-green-300 transition-colors duration-300 text-sm lg:text-base font-medium">{t('nav.about')}</button>
              <button onClick={() => navigate('/analysis')} className="hover:text-green-300 transition-colors duration-300 text-sm lg:text-base font-medium">{t('nav.analysis')}</button>
              <button onClick={() => navigate('/insights')} className="hover:text-green-300 transition-colors duration-300 text-sm lg:text-base font-medium">{t('nav.insights')}</button>
              <button onClick={() => navigate('/ai-analytics')} className="hover:text-green-300 transition-colors duration-300 text-sm lg:text-base font-medium">{t('nav.ai_analytics')}</button>
              <button onClick={() => navigate('/automation')} className="hover:text-green-300 transition-colors duration-300 text-sm lg:text-base font-medium">Automation</button>
            </div>
          </div>
          
          {/* Language Switcher & Contact Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <button 
              onClick={() => navigate('/contact')} 
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
            >
              <span>{t('nav.contact')}</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-black/90 transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} className="text-white" />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-8 mt-16">
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-green-400">{t('nav.home')}</button>
          <button onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-gray-300 hover:text-green-300">{t('nav.about')}</button>
          <button onClick={() => { navigate('/analysis'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-gray-300 hover:text-green-300">{t('nav.analysis')}</button>
          <button onClick={() => { navigate('/insights'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-gray-300 hover:text-green-300">{t('nav.insights')}</button>
          <button onClick={() => { navigate('/ai-analytics'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-gray-300 hover:text-green-300">{t('nav.ai_analytics')}</button>
          <button onClick={() => { navigate('/automation'); setIsMobileMenuOpen(false); }} className="text-3xl font-bold text-gray-300 hover:text-green-300">Automation</button>
          <button onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} className="mt-8 bg-green-500 px-8 py-3 rounded-full font-bold text-xl">{t('nav.contact')}</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-20 pb-10 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Section - Hero & Features */}
        <div className="flex-1 flex flex-col space-y-8 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-tight tracking-tighter">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-white to-green-700">{t('hero.title1')}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-500 to-green-300">{t('hero.title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
            {t('hero.tagline')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={() => navigate('/farming-tool')}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
            >
              <Leaf className="w-5 h-5" />
              <span>{t('hero.cta_farming_ai')}</span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className="flex items-center justify-center space-x-2 bg-{rgb} hover:bg-teal-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30"
            >
              
              <span>{t('hero.cta_learn_more')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 lg:pt-20">
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 text-center border border-green-400/30 shadow-lg shadow-green-500/10">
              <div className="bg-green-400/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-gray-300 font-medium text-sm">{t('features.crop_disease')}</div>
              <div className="font-bold tracking-wide text-white">{t('features.detection')}</div>
            </div>
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 text-center border border-green-400/30 shadow-lg shadow-green-500/10">
              <div className="bg-green-400/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-gray-300 font-medium text-sm">{t('features.ai_powered')}</div>
              <div className="font-bold tracking-wide text-white">{t('features.insights')}</div>
            </div>
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 text-center border border-green-400/30 shadow-lg shadow-green-500/10">
              <div className="bg-green-400/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-gray-300 font-medium text-sm">{t('features.yield')}</div>
              <div className="font-bold tracking-wide text-white">{t('features.optimization')}</div>
            </div>
            <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 text-center border border-green-400/30 shadow-lg shadow-green-500/10">
              <div className="bg-green-400/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-gray-300 font-medium text-sm">{t('features.smart')}</div>
              <div className="font-bold tracking-wide text-white">{t('features.automation')}</div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Live Data Dashboard */}
        <div className="flex-1 w-full lg:w-auto mt-12 lg:mt-0 flex flex-col justify-center items-center">
          <GlassCard extraClasses="w-full max-w-sm shadow-2xl shadow-green-500/20 border-green-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Cloud className="size-4" />
                <span className="font-medium">Chaprashirat Noakhali, BD</span>
              </div>
              <Cloud className="size-8 text-green-400" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl md:text-6xl font-black text-white tracking-tight">+20°C</div>
              <div className="text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Thermometer className="size-4" />
                  <span className="font-medium">H: 22°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Thermometer className="size-4" />
                  <span className="font-medium">L: 18°C</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
                <Droplet className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-gray-300 font-medium">{t('weather.humidity')}</div>
                <div className="font-bold tracking-wide">40%</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
                <Wind className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-gray-300 font-medium">{t('weather.wind')}</div>
                <div className="font-bold tracking-wide">23 m/s</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
                <Droplet className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-gray-300 font-medium">{t('weather.precipitation')}</div>
                <div className="font-bold tracking-wide">9.5 ml</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-gray-300 font-medium">{t('weather.yield')}</div>
                <div className="font-bold tracking-wide">+15%</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/80 border-t border-green-400/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-black text-white tracking-tight mb-4">
                <span className="text-green-400">AgriFarm</span>AI 
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {t('footer.brand_desc')}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                  <span className="text-green-400 text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                  <span className="text-green-400 text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                  <span className="text-green-400 text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.quick_links')}</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="text-gray-300 hover:text-green-400 transition-colors">{t('nav.home')}</button></li>
                <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-green-400 transition-colors">{t('nav.about')}</button></li>
                <li><button onClick={() => navigate('/analysis')} className="text-gray-300 hover:text-green-400 transition-colors">{t('nav.analysis')}</button></li>
                <li><button onClick={() => navigate('/insights')} className="text-gray-300 hover:text-green-400 transition-colors">{t('nav.insights')}</button></li>
                <li><button onClick={() => navigate('/farming-tool')} className="text-gray-300 hover:text-green-400 transition-colors">{t('footer.ai_tools')}</button></li>
              </ul>
            </div>
            
        
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{t('footer.copy')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">{t('footer.privacy')}</button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">{t('footer.terms')}</button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">{t('footer.sdg2')}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
