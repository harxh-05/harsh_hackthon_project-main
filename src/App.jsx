import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { initDevToolsBlocker } from './utils/devToolsBlocker';
import APISetupGuide from './components/APISetupGuide';
import Home from './pages/Home';
import About from './pages/About';
import Analysis from './pages/Analysis';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Login from './pages/Login';
import FarmingTool from './components/FarmingTool';
import GeoSoilAnalysis from './pages/GeoSoilAnalysis';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load heavy AI components
const SoilAnalysis = lazy(() => import('./pages/SoilAnalysis'));
const CropHealth = lazy(() => import('./pages/CropHealth'));
const MarketIntel = lazy(() => import('./pages/MarketIntel'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const AIAnalytics = lazy(() => import('./pages/AIAnalytics'));
const MedicalDashboard = lazy(() => import('./pages/MedicalDashboard'));
const MedicalDiagnosis = lazy(() => import('./pages/MedicalDiagnosis'));
const MedicalVitals = lazy(() => import('./pages/MedicalVitals'));
const MedicalPredictor = lazy(() => import('./pages/MedicalPredictor'));
const MedicalAnalytics = lazy(() => import('./pages/MedicalAnalytics'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
  </div>
);

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
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
        <APISetupGuide />
      </Router>
    </AuthProvider>
  );
}

export default App;