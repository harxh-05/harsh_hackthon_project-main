import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { initDevToolsBlocker } from './utils/devToolsBlocker';
import Home from './pages/Home';
import About from './pages/About';
import AIAnalytics from './pages/AIAnalytics';
import Analysis from './pages/Analysis';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Login from './pages/Login';
import FarmingTool from './components/FarmingTool';
import SoilAnalysis from './pages/SoilAnalysis';
import GeoSoilAnalysis from './pages/GeoSoilAnalysis';
import CropHealth from './pages/CropHealth';
import Monitoring from './pages/Monitoring';
import MarketIntel from './pages/MarketIntel';
import MedicalDashboard from './pages/MedicalDashboard';
import MedicalDiagnosis from './pages/MedicalDiagnosis';
import MedicalVitals from './pages/MedicalVitals';
import MedicalPredictor from './pages/MedicalPredictor';
import MedicalAnalytics from './pages/MedicalAnalytics';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '0.0.0.0';
    
    if (!isLocalhost) {
      initDevToolsBlocker();
    }
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-analytics" element={<AIAnalytics />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/farming-tool" element={<FarmingTool />} />
          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          <Route path="/geo-soil-analysis" element={<GeoSoilAnalysis />} />
          <Route path="/crop-health" element={<CropHealth />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/market-intel" element={<MarketIntel />} />
          <Route path="/medical-dashboard" element={<ProtectedRoute><MedicalDashboard /></ProtectedRoute>} />
          <Route path="/medical-diagnosis" element={<ProtectedRoute><MedicalDiagnosis /></ProtectedRoute>} />
          <Route path="/medical-vitals" element={<ProtectedRoute><MedicalVitals /></ProtectedRoute>} />
          <Route path="/medical-predictor" element={<ProtectedRoute><MedicalPredictor /></ProtectedRoute>} />
          <Route path="/medical-analytics" element={<ProtectedRoute><MedicalAnalytics /></ProtectedRoute>} />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
