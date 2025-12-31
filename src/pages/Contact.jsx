import { Mail, Phone, MapPin, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const images = [
   
    'https://img.freepik.com/premium-photo/generative-ai-plant-growing-from-circuit-board-ecology-environment-conceptx9xa_93150-32770.jpg',
    'https://img.freepik.com/premium-photo/generative-ai-plant-growing-from-circuit-board-ecology-environment-conceptx9xa_93150-32770.jpg'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* SVG Clip Path Definitions */}
      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id="polygon-clip-1">
            <path d="M 87.26477090413202,0 C 84.32855514545265,29.64130419798463 75.22636960464351,36.11933702559631 53.41017687861051,53.4101768786105 C 31.5939841525775,70.70101673162469 25.24043055518949,70.62801729617252 4.235034336112663e-15,69.16335941205675 C -25.240430555189484,67.69870152794098 -25.107358262274794,64.84238519516163 -47.55154534214744,47.55154534214745 C -69.9957324220201,30.260705489133265 -89.8118646540933,23.740656336471023 -89.7767483194906,1.0994480746732168e-14 C -89.74163198488789,-23.740656336471 -69.85526708360925,-24.362986870098208 -47.41108000373661,-47.41108000373659 C -24.966892923863963,-70.45917313737498 -28.14152997926617,-87.75638255715567 -1.69354640895362e-14,-92.19237253455353 C 28.141529979266135,-96.62836251195138 43.33884718729499,-88.2031330469664 65.155039913328,-65.15503991332803 C 86.971232639361,-42.10694677968964 90.20098666281139,-29.64130419798463 87.26477090413202,0 Z" transform="translate(100,100) scale(1.2)"/>
          </clipPath>
          <clipPath id="polygon-clip-2">
            <path d="M 57.70502794886029,0 C 58.61078990900091,27.15333143057662 77.54346882869962,36.46227527721244 66.53168448686314,55.82671191453002 C 55.51990014502666,75.1911485518476 41.29283715998315,72.35835745064044 13.657890581514364,77.45774654927033 C -13.977055996954421,82.55713564790021 -20.780163206258997,88.3771930936847 -44.008101827012,76.22426830904956 C -67.23604044776499,64.07134352441443 -68.62541711716821,55.77496253686758 -79.25386390149764,28.846047410729827 C -89.88231068582706,1.917132284592082 -95.80896887584557,-6.047644860131022 -86.52188896432969,-31.49139219550142 C -77.23480905281382,-56.935139530871815 -68.12282762274194,-55.92294779336849 -42.10554425543416,-72.92894193075176 C -16.088260888126378,-89.93493606813503 -8.706300720532273,-104.55095077577833 17.54724450490144,-99.51536874503451 C 43.800789730335154,-94.47978671429068 52.86919078531098,-77.66545599403509 62.908636646300685,-52.78661380777646 C 72.9480825072904,-27.907771621517835 56.799265988719675,-27.15333143057662 57.70502794886029,0 Z" transform="translate(100,100) scale(1.2)"/>
          </clipPath>
        </defs>
      </svg>
      
      {/* Background Glows & Decorative SVG Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        {/* Decorative SVG Shape 1 */}
        <div
          className="absolute top-32 right-20 w-80 h-80 opacity-20 transition-all duration-700 transform hover:scale-110"
          style={{
            clipPath: 'url(#polygon-clip-1)',
            backgroundImage: `url('${images[0]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        {/* Decorative SVG Shape 2 */}
        <div
          className="absolute bottom-40 left-16 w-96 h-96 opacity-15 transition-all duration-700 transform hover:scale-110"
          style={{
            clipPath: 'url(#polygon-clip-2)',
            backgroundImage: `url('${images[1]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
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
            {t('pages.contact.title1')} <br /> {t('pages.contact.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Contact Info Section */}
          <div className="space-y-8 flex flex-col items-center lg:items-start">

            <InfoCard 
              icon={<MapPin className="w-8 h-8 text-green-400" />}
              title={t('pages.contact.our_location')}
              content="123 AgTech Plaza, Silicon Valley, CA 94025"
            />
            <InfoCard 
              icon={<Mail className="w-8 h-8 text-green-400" />}
              title={t('pages.contact.email_us')}
              content="support@agrifarm-ai.com"
            />
            <InfoCard 
              icon={<Phone className="w-8 h-8 text-green-400" />}
              title={t('pages.contact.call_us')}
              content="+1 (555) 123-4567"
            />
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">{t('pages.contact.send_us_message')}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">{t('pages.contact.full_name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 transition-all duration-300"
                  placeholder={t('pages.contact.placeholders.name')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-300">{t('pages.contact.email_address')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 transition-all duration-300"
                  placeholder={t('pages.contact.placeholders.email')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-300">{t('pages.contact.subject')}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white appearance-none pr-8 transition-all duration-300 cursor-pointer"
                >
                  <option value="">Select a subject...</option>
                  <option value="general">General Inquiry</option>
                  <option value="demo">Request Demo</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="pricing">Pricing Information</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-300">{t('pages.contact.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 resize-none transition-all duration-300"
                  placeholder={t('pages.contact.placeholders.message')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-green-500/30"
              >
                <Send className="w-5 h-5" />
                <span>{t('common.send_message')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>{t('footer.copy')}</p>
      </div>
    </div>
  );
};

// Reusable component for contact info cards
const InfoCard = ({ icon, title, content }) => (
  <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-xl shadow-green-500/10 backdrop-filter backdrop-blur-sm flex items-center space-x-6 w-full">
    <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{content}</p>
    </div>
  </div>
);

export default Contact;