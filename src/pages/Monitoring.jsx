import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Satellite, BarChart3, Droplets, Thermometer, AlertTriangle, CheckCircle, Target, TrendingUp, Loader, Upload, FileText, Mic, MicOff } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';
import { BaseAI } from '../services/baseAI';
import { useTranslation } from 'react-i18next';
import { validateInput, getFieldLimits } from '../utils/validationLimits';

const Monitoring = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState({
    soilMoisture: '',
    airTemperature: '',
    humidity: '',
    lightIntensity: '',
    rainfall: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monitoringResults, setMonitoringResults] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [docValidation, setDocValidation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const analyzeMonitoringData = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await FarmerAI.optimizeIrrigation(sensorData);
      console.log('Monitoring analysis result:', analysis);
      setMonitoringResults(analysis);
    } catch (error) {
      console.error('Monitoring analysis error:', error);
      setMonitoringResults({
        error: 'AI monitoring analysis failed. Please check your data and try again.',
        overallStatus: 'Unknown'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDoc(file);
      processDocument(file);
    }
  };

  const processDocument = async (file) => {
    setIsProcessingDoc(true);
    setProcessingProgress(0);
    
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        const systemPrompt = `Extract IoT sensor data from this document. Check for ALL these fields and return ONLY valid JSON:
{
  "extractedData": {
    "soilMoisture": "soil moisture percentage or null",
    "airTemperature": "air temperature in celsius or null",
    "humidity": "humidity percentage or null",
    "lightIntensity": "light intensity in lux or null",
    "rainfall": "rainfall in mm or null"
  },
  "validation": {
    "isComplete": true/false,
    "extractedCount": "number of fields extracted",
    "totalFields": 5,
    "missingFields": ["list of missing field names"],
    "confidence": "High/Medium/Low",
    "message": "Document analysis result"
  }
}`;
        
        const extractedData = await BaseAI.callAPI(
          `Analyze this IoT sensor report and extract all sensor readings. Document content: ${fileData}`,
          systemPrompt
        );
        
        const parsed = BaseAI.parseJSON(extractedData);
        if (parsed && parsed.extractedData && parsed.validation) {
          const validData = Object.fromEntries(
            Object.entries(parsed.extractedData).filter(([_, value]) => value && value !== "null" && value !== "")
          );
          setSensorData(prev => ({ ...prev, ...validData }));
          
          setDocValidation({
            isValid: parsed.validation.isComplete,
            message: parsed.validation.message,
            extractedFields: Object.keys(validData),
            missingFields: parsed.validation.missingFields || [],
            confidence: parsed.validation.confidence,
            extractedCount: parsed.validation.extractedCount,
            totalFields: parsed.validation.totalFields
          });
        } else {
          setDocValidation({
            isValid: false,
            message: "Could not extract sensor data from document. Please ensure it contains IoT sensor readings.",
            extractedFields: [],
            missingFields: Object.keys(sensorData),
            confidence: "Low",
            extractedCount: 0,
            totalFields: 5
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Document processing error:', error);
      alert('Failed to process sensor report. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessingDoc(false);
        setProcessingProgress(0);
      }, 500);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript('');
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceTranscript(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (voiceTranscript.trim()) {
        processVoiceInput(voiceTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceInput = async (transcript) => {
    try {
      const systemPrompt = `Extract IoT sensor data from this voice input. Return ONLY valid JSON:
{
  "soilMoisture": "soil moisture percentage if mentioned",
  "airTemperature": "air temperature if mentioned",
  "humidity": "humidity percentage if mentioned",
  "lightIntensity": "light intensity if mentioned",
  "rainfall": "rainfall amount if mentioned"
}`;
      
      const extractedData = await BaseAI.callAPI(
        `Extract sensor information from this voice input: "${transcript}"`,
        systemPrompt
      );
      
      const parsed = BaseAI.parseJSON(extractedData);
      if (parsed) {
        setSensorData(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(parsed).filter(([_, value]) => value && value !== "")
          )
        }));
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      alert('Failed to process voice input. Please try again.');
    }
  };

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
            onClick={() => navigate('/farming-tool')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_farming_tool')}</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            {t('pages.monitoring.title1')} <br /> {t('pages.monitoring.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.monitoring.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Sensor Input Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Satellite className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{t('pages.monitoring.iot_sensor_data')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Soil Moisture (%)
                </label>
                <div>
                  <input
                    type="text"
                    value={sensorData.soilMoisture}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSensorData(prev => ({...prev, soilMoisture: newValue}));
                      
                      const validation = validateInput(newValue, 'soilMoisture', 'monitoring');
                      setValidationErrors(prev => ({
                        ...prev,
                        soilMoisture: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="35"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.soilMoisture 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.soilMoisture && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.soilMoisture}</p>
                  )}
                  {getFieldLimits('soilMoisture', 'monitoring') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('soilMoisture', 'monitoring')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Thermometer className="w-4 h-4 inline mr-1" />
                  Air Temperature (°C)
                </label>
                <div>
                  <input
                    type="text"
                    value={sensorData.airTemperature}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSensorData(prev => ({...prev, airTemperature: newValue}));
                      
                      const validation = validateInput(newValue, 'airTemperature', 'monitoring');
                      setValidationErrors(prev => ({
                        ...prev,
                        airTemperature: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="28"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.airTemperature 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.airTemperature && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.airTemperature}</p>
                  )}
                  {getFieldLimits('airTemperature', 'monitoring') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('airTemperature', 'monitoring')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Humidity (%)</label>
                <div>
                  <input
                    type="text"
                    value={sensorData.humidity}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSensorData(prev => ({...prev, humidity: newValue}));
                      
                      const validation = validateInput(newValue, 'humidity', 'monitoring');
                      setValidationErrors(prev => ({
                        ...prev,
                        humidity: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="65"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.humidity 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.humidity && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.humidity}</p>
                  )}
                  {getFieldLimits('humidity', 'monitoring') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('humidity', 'monitoring')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Light Intensity (lux)</label>
                <div>
                  <input
                    type="text"
                    value={sensorData.lightIntensity}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSensorData(prev => ({...prev, lightIntensity: newValue}));
                      
                      const validation = validateInput(newValue, 'lightIntensity', 'monitoring');
                      setValidationErrors(prev => ({
                        ...prev,
                        lightIntensity: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="45000"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.lightIntensity 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.lightIntensity && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.lightIntensity}</p>
                  )}
                  {getFieldLimits('lightIntensity', 'monitoring') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('lightIntensity', 'monitoring')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recent Rainfall (mm)</label>
                <div>
                  <input
                    type="text"
                    value={sensorData.rainfall}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSensorData(prev => ({...prev, rainfall: newValue}));
                      
                      const validation = validateInput(newValue, 'rainfall', 'monitoring');
                      setValidationErrors(prev => ({
                        ...prev,
                        rainfall: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="12"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.rainfall 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.rainfall && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.rainfall}</p>
                  )}
                  {getFieldLimits('rainfall', 'monitoring') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('rainfall', 'monitoring')}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                {isProcessingDoc ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Report</span>
                  </>
                )}
              </button>
              <button
                 onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isAnalyzing || isProcessingDoc}
                className={`flex items-center justify-center space-x-2 py-4 rounded-lg transition-all duration-300 font-semibold ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white disabled:bg-gray-600 disabled:text-gray-400`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Voice Input</span>
                  </>
                )}
              </button>
              <button
                onClick={analyzeMonitoringData}
                disabled={!sensorData.soilMoisture || Object.values(validationErrors).some(error => error) || isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-green-400 text-black py-4 rounded-lg hover:bg-green-300 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing Data...</span>
                  </>
                ) : (
                  <>
                    <Satellite className="w-5 h-5" />
                    <span>Analyze Monitoring</span>
                  </>
                )}
              </button>
            </div>
            {isListening && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-orange-400 mb-2">
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">Listening for sensor data... Speak now</span>
                </div>
                {voiceTranscript && (
                  <p className="text-gray-300 text-sm italic">"{voiceTranscript}"</p>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleDocumentUpload}
              className="hidden"
            />
            {uploadedDoc && (
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-400 mb-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Sensor Report Uploaded:</span>
                  <span>{uploadedDoc.name}</span>
                </div>
                {isProcessingDoc && (
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-600"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-purple-500"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${processingProgress}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-300">{Math.round(processingProgress)}%</span>
                      </div>
                    </div>
                    <div className="text-sm text-purple-300">
                      <div className="font-medium">AI Processing Document...</div>
                      <div className="text-xs opacity-75">Extracting sensor data</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Document Validation Results */}
            {docValidation && (
              <div className={`mt-4 p-4 rounded-xl border ${
                docValidation.isValid 
                  ? 'bg-green-900/20 border-green-500/30 text-green-300'
                  : 'bg-red-900/20 border-red-500/30 text-red-300'
              }`}>
                <div className="flex items-start gap-3">
                  {docValidation.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      {docValidation.isValid ? 'Document Validated Successfully' : 'Document Incomplete'}
                    </p>
                    <p className="text-sm opacity-90 mb-3">{docValidation.message}</p>
                    
                    {docValidation.extractedFields && docValidation.extractedFields.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Extracted Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {docValidation.extractedFields.map(field => (
                            <span key={field} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {docValidation.missingFields && docValidation.missingFields.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Missing Required Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {docValidation.missingFields.map(field => (
                            <span key={field} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs mt-2 opacity-75">
                          Please upload a complete document with all required sensor data.
                        </p>
                      </div>
                    )}
                    
                    {docValidation.confidence && (
                      <div className="mt-3 text-xs opacity-75">
                        <p>Confidence: {docValidation.confidence}</p>
                        {docValidation.extractedCount !== undefined && (
                          <p>Fields Found: {docValidation.extractedCount}/{docValidation.totalFields || 5}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monitoring Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Monitoring Insights</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-400 font-medium">Processing sensor data...</p>
              </div>
            )}
            {monitoringResults && !isAnalyzing && (
              <div className="space-y-8">
                {monitoringResults.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{monitoringResults.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overall Status */}
                    <div className="text-center p-6 bg-gray-800/50 border border-green-400/30 rounded-[20px] hover:border-green-400/50 transition-all duration-300">
                      <div className={`text-4xl font-bold mb-2 ${
                        monitoringResults.overallStatus === 'Optimal' ? 'text-green-400' :
                        monitoringResults.overallStatus === 'Good' ? 'text-green-300' :
                        monitoringResults.overallStatus === 'Warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {monitoringResults.overallStatus || 'Optimal'}
                      </div>
                      <div className="text-gray-300 font-medium">Overall Farm Status</div>
                    </div>

                    {/* Sensor Analysis Grid */}
                    {monitoringResults.sensorAnalysis && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Satellite className="w-5 h-5 mr-2 text-blue-400" />
                          Sensor Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {Object.entries(monitoringResults.sensorAnalysis || {
                            soilMoisture: { status: 'Optimal', recommendation: 'Moisture levels are perfect' },
                            temperature: { status: 'Good', recommendation: 'Temperature within range' },
                            humidity: { status: 'Optimal', recommendation: 'Humidity levels ideal' },
                            lightIntensity: { status: 'Good', recommendation: 'Light exposure adequate' }
                          }).map(([sensor, data]) => (
                            <div key={sensor} className={`p-6 bg-gray-800/50 border rounded-[20px] hover:border-opacity-50 transition-all duration-300 ${
                              data.status === 'Optimal' ? 'border-green-400/30 hover:border-green-400/50' :
                              data.status === 'Good' ? 'border-blue-400/30 hover:border-blue-400/50' :
                              data.status === 'Low' ? 'border-yellow-400/30 hover:border-yellow-400/50' : 'border-red-400/30 hover:border-red-400/50'
                            }`}>
                              <div className="font-medium capitalize text-white mb-2">{sensor.replace(/([A-Z])/g, ' $1').trim()}</div>
                              <div className={`text-2xl font-bold mb-2 ${
                                data.status === 'Optimal' ? 'text-green-400' :
                                data.status === 'Good' ? 'text-blue-400' :
                                data.status === 'Low' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {data.status}
                              </div>
                              <div className="text-sm text-gray-300">{data.recommendation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alerts Section */}
                    {monitoringResults.alerts && monitoringResults.alerts.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                          Active Alerts
                        </h4>
                        <div className="space-y-4">
                          {monitoringResults.alerts.map((alert, index) => (
                            <div key={index} className={`p-6 rounded-xl border hover:border-opacity-50 transition-all duration-300 bg-gray-800/50 ${
                              alert.severity === 'Critical' ? 'border-red-400/30' :
                              alert.severity === 'High' ? 'border-orange-400/30' :
                              alert.severity === 'Medium' ? 'border-yellow-400/30' : 'border-blue-400/30'
                            }`}>
                              <div className="flex justify-between mb-3">
                                <h5 className={`font-bold text-lg ${
                                  alert.severity === 'Critical' ? 'text-red-400' :
                                  alert.severity === 'High' ? 'text-orange-400' :
                                  alert.severity === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                                }`}>
                                  {alert.type}
                                </h5>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  alert.severity === 'Critical' ? 'bg-red-400/20 text-red-400' :
                                  alert.severity === 'High' ? 'bg-orange-400/20 text-orange-400' :
                                  alert.severity === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-blue-400/20 text-blue-400'
                                }`}>
                                  {alert.severity}
                                </span>
                              </div>
                              <p className="text-sm mb-3 text-gray-300">
                                {alert.message}
                              </p>
                              <div className="p-3 rounded text-sm font-medium bg-gray-700/50 text-white">
                                Action: {alert.action}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations Grid */}
                    {monitoringResults.recommendations && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          AI Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.recommendations).map(([key, value]) => (
                            <div key={key} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                              <h5 className="font-medium text-green-400 mb-3 capitalize flex items-center">
                                {key === 'irrigation' && <Droplets className="w-4 h-4 mr-1" />}
                                {key === 'climate' && <Thermometer className="w-4 h-4 mr-1" />}
                                {key === 'timing' && <Target className="w-4 h-4 mr-1" />}
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-gray-300">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Predictions Grid */}
                    {monitoringResults.predictions && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                          AI Predictions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.predictions).map(([key, value]) => (
                            <div key={key} className="p-6 bg-gray-800/50 rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
                              <h5 className="font-medium text-purple-400 mb-3 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-gray-300">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Plan */}
                    {monitoringResults.actionPlan && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-400" />
                          Action Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {monitoringResults.actionPlan.immediate && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30">
                              <h5 className="font-medium text-red-400 mb-3">Immediate</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.immediate.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {monitoringResults.actionPlan.today && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-orange-400/30">
                              <h5 className="font-medium text-orange-400 mb-3">Today</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.today.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {monitoringResults.actionPlan.thisWeek && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                              <h5 className="font-medium text-blue-400 mb-3">This Week</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.thisWeek.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Optimization */}
                    {monitoringResults.optimization && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                          Optimization Opportunities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.optimization).map(([key, value]) => (
                            <div key={key}>
                              <h5 className="font-medium text-green-400 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              {Array.isArray(value) ? (
                                <ul className="list-disc ml-5 text-gray-300">
                                  {value.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-300">{value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!monitoringResults && !isAnalyzing && (
              <div className="text-center py-16 text-green-600">
                <Satellite className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">Enter sensor data to monitor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;