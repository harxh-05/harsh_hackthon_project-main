import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, BarChart3, Bug, Beaker, Zap, Target, CheckCircle, DollarSign, Loader, AlertTriangle, X, Upload, FileText, Mic, MicOff } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';
import CustomDropdown from '../components/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { validateInput, getFieldLimits } from '../utils/validationLimits';

const CropHealth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cropData, setCropData] = useState({
    cropType: '',
    plantingDate: '',
    fieldSize: '',
    symptoms: '',
    location: '',
    weatherConditions: '',
    variety: '',
    growthStage: '',
    irrigationMethod: '',
    fertilizer: '',
    pesticide: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMessage, setStepMessage] = useState('');
  const [cropAnalysis, setCropAnalysis] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [docValidation, setDocValidation] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const analyzeCropWithAI = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setStepMessage('');
    try {
      const analysis = await FarmerAI.analyzeCrop(cropData, (step, message) => {
        setCurrentStep(step);
        setStepMessage(message);
      });
      setCropAnalysis(analysis);
    } catch (error) {
      console.error('Crop analysis error:', error);
      setCropAnalysis({
        error: 'AI crop analysis failed. Please check your data and try again.',
        cropHealth: 'Unknown'
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(0);
      setStepMessage('');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setCameraOpen(true);
      
      // Wait for next tick to ensure modal is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error('Camera access error:', error);
      // Try with user camera if environment camera fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        setCameraOpen(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      } catch (fallbackError) {
        console.error('Fallback camera error:', fallbackError);
        alert('Camera access denied or not available. Please check permissions.');
      }
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraOpen(false);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const imageAnalysis = {
        ...cropData,
        imageData: capturedImage,
        analysisType: 'visual'
      };
      const analysis = await FarmerAI.analyzeCrop(imageAnalysis);
      setCropAnalysis(analysis);
    } catch (error) {
      console.error('Image analysis error:', error);
      setCropAnalysis({
        error: 'AI image analysis failed. Please try again.',
        cropHealth: 'Unknown'
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
    setDocValidation(null);
    setProcessingProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);
    
    // Validate file type - Only documents and text files
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setDocValidation({
        isValid: false,
        message: 'Invalid file type. Please upload PDF, TXT, DOC, or DOCX documents only. Images are not supported for document upload.',
        missingFields: []
      });
      setIsProcessingDoc(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        const systemPrompt = `Extract crop health data from this document. Check for ALL these fields and return ONLY valid JSON:
{
  "extractedData": {
    "cropType": "crop name (e.g., Wheat, Rice, Tomato) or null",
    "variety": "crop variety (e.g., Basmati, IR64, Cherry) or null",
    "plantingDate": "planting date in YYYY-MM-DD format or null",
    "fieldSize": "field size in acres or null",
    "growthStage": "growth stage (Seedling/Vegetative/Flowering/Fruiting/Maturity) or null",
    "symptoms": "observed symptoms description or null",
    "location": "farm location (City, State) or null",
    "weatherConditions": "weather conditions (rainfall, temperature) or null",
    "irrigationMethod": "irrigation method (Drip/Sprinkler/Flood/Rainfed) or null",
    "fertilizer": "fertilizer used (e.g., NPK 10:26:26, Urea) or null",
    "pesticide": "pesticide applied (e.g., Neem oil, Chlorpyrifos) or null"
  },
  "validation": {
    "isComplete": true/false,
    "extractedCount": "number of fields extracted",
    "totalFields": 11,
    "missingFields": ["list of missing field names"],
    "confidence": "High/Medium/Low",
    "message": "Document analysis result"
  }
}`;
        
        const response = await FarmerAI.callAPI(
          `Analyze this crop document for completeness. Required fields: cropType, plantingDate, fieldSize, symptoms, location. Document content: ${fileData}`,
          systemPrompt
        );
        
        const parsed = FarmerAI.parseJSON(response);
        if (parsed && parsed.extractedData && parsed.validation) {
          // Update form data with extracted information
          const validData = Object.fromEntries(
            Object.entries(parsed.extractedData).filter(([_, value]) => value && value !== "null" && value !== "")
          );
          
          setCropData(prev => ({ ...prev, ...validData }));
          
          // Set validation results
          setDocValidation({
            isValid: parsed.validation.isComplete,
            message: parsed.validation.message,
            missingFields: parsed.validation.missingFields || [],
            confidence: parsed.validation.confidence,
            extractedFields: Object.keys(validData),
            extractedCount: parsed.validation.extractedCount || Object.keys(validData).length,
            totalFields: parsed.validation.totalFields || 11
          });
        } else {
          setDocValidation({
            isValid: false,
            message: 'Document content appears to be non-text or unreadable, containing no extractable agricultural data.',
            missingFields: ['cropType', 'variety', 'plantingDate', 'fieldSize', 'growthStage', 'symptoms', 'location', 'weatherConditions', 'irrigationMethod', 'fertilizer', 'pesticide'],
            extractedCount: 0,
            totalFields: 11,
            confidence: 'Low'
          });
        }
      };
      
      // Read all files as text since we only accept documents
      reader.readAsText(file);
    } catch (error) {
      console.error('Document processing error:', error);
      setDocValidation({
        isValid: false,
        message: 'Failed to process document. Please try again with a different file.',
        missingFields: []
      });
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
      const systemPrompt = `Extract crop health data from this voice input. Return ONLY valid JSON:
{
  "cropType": "crop name if mentioned",
  "variety": "variety if mentioned", 
  "fieldSize": "field size if mentioned",
  "symptoms": "symptoms described",
  "location": "location if mentioned",
  "weatherConditions": "weather if mentioned",
  "growthStage": "growth stage if mentioned",
  "irrigationMethod": "irrigation if mentioned",
  "fertilizer": "fertilizer if mentioned",
  "pesticide": "pesticide if mentioned"
}`;
      
      const extractedData = await FarmerAI.callAPI(
        `Extract crop information from this voice input: "${transcript}"`,
        systemPrompt
      );
      
      const parsed = FarmerAI.parseJSON(extractedData);
      if (parsed) {
        setCropData(prev => ({
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
            {t('pages.crop_health.title1')} <br /> {t('pages.crop_health.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.crop_health.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Crop Input Card */}
          <div className={`bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 ${dropdownOpen ? 'pb-32' : ''}`}>
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{t('pages.crop_health.assessment')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Crop Type</label>
                <div>
                  <input
                    type="text"
                    value={cropData.cropType}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCropData(prev => ({...prev, cropType: newValue}));
                      
                      const validation = validateInput(newValue, 'cropType', 'crop');
                      setValidationErrors(prev => ({
                        ...prev,
                        cropType: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="e.g., Wheat, Rice, Tomato"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.cropType 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.cropType && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.cropType}</p>
                  )}
                  {getFieldLimits('cropType', 'crop') && (
                    <p className="text-gray-500 text-xs mt-1">{getFieldLimits('cropType', 'crop')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Crop Variety</label>
                <div>
                  <input
                    type="text"
                    value={cropData.variety || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCropData(prev => ({...prev, variety: newValue}));
                      
                      const validation = validateInput(newValue, 'variety', 'crop');
                      setValidationErrors(prev => ({
                        ...prev,
                        variety: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="e.g., Basmati, IR64, Cherry"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.variety 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.variety && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.variety}</p>
                  )}
                  {getFieldLimits('variety', 'crop') && (
                    <p className="text-gray-500 text-xs mt-1">{getFieldLimits('variety', 'crop')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Planting Date</label>
                <input
                  type="date"
                  value={cropData.plantingDate}
                  onChange={(e) => setCropData(prev => ({...prev, plantingDate: e.target.value}))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Growth Stage</label>
                <CustomDropdown
                  value={cropData.growthStage || ''}
                  onChange={(value) => setCropData(prev => ({...prev, growthStage: value}))}
                  placeholder="Select Stage"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Seedling', label: 'Seedling' },
                    { value: 'Vegetative', label: 'Vegetative' },
                    { value: 'Flowering', label: 'Flowering' },
                    { value: 'Fruiting', label: 'Fruiting' },
                    { value: 'Maturity', label: 'Maturity' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Field Size (acres)</label>
                <div>
                  <input
                    type="text"
                    value={cropData.fieldSize}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCropData(prev => ({...prev, fieldSize: newValue}));
                      
                      const validation = validateInput(newValue, 'fieldSize', 'crop');
                      setValidationErrors(prev => ({
                        ...prev,
                        fieldSize: validation.isValid ? null : validation.message
                      }));
                    }}
                    placeholder="5"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.fieldSize 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-700/50 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {validationErrors.fieldSize && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.fieldSize}</p>
                  )}
                  {getFieldLimits('fieldSize', 'crop') && (
                    <p className="text-gray-500 text-xs mt-1">Range: {getFieldLimits('fieldSize', 'crop')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Irrigation Method</label>
                <CustomDropdown
                  value={cropData.irrigationMethod || ''}
                  onChange={(value) => setCropData(prev => ({...prev, irrigationMethod: value}))}
                  placeholder="Select Method"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Drip', label: 'Drip Irrigation' },
                    { value: 'Sprinkler', label: 'Sprinkler' },
                    { value: 'Flood', label: 'Flood Irrigation' },
                    { value: 'Rainfed', label: 'Rainfed' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fertilizer Used</label>
                <input
                  type="text"
                  value={cropData.fertilizer || ''}
                  onChange={(e) => setCropData(prev => ({...prev, fertilizer: e.target.value}))}
                  placeholder="e.g., NPK 10:26:26, Urea"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pesticide Applied</label>
                <input
                  type="text"
                  value={cropData.pesticide || ''}
                  onChange={(e) => setCropData(prev => ({...prev, pesticide: e.target.value}))}
                  placeholder="e.g., Neem oil, Chlorpyrifos"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={cropData.location}
                  onChange={(e) => setCropData(prev => ({...prev, location: e.target.value}))}
                  placeholder="City, State"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Observed Symptoms</label>
                <textarea
                  value={cropData.symptoms}
                  onChange={(e) => setCropData(prev => ({...prev, symptoms: e.target.value}))}
                  placeholder="Describe symptoms..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Weather Conditions</label>
                <input
                  type="text"
                  value={cropData.weatherConditions}
                  onChange={(e) => setCropData(prev => ({...prev, weatherConditions: e.target.value}))}
                  placeholder="Rainfall, temperature..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
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
                onClick={startCamera}
                disabled={isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                <Camera className="w-5 h-5" />
                <span>Camera Scan</span>
              </button>
              <button
                onClick={analyzeCropWithAI}
                disabled={!cropData.cropType || Object.values(validationErrors).some(error => error) || isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-green-400 text-black py-4 rounded-lg hover:bg-green-300 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    <span>Analyze Data</span>
                  </>
                )}
              </button>
            </div>
            {isListening && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-orange-400 mb-2">
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">Listening... Speak now</span>
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
                  <span className="font-medium">Document Uploaded:</span>
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
                      <div className="text-xs opacity-75">Extracting field data</div>
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
                          Please upload a complete document with all required crop health information.
                        </p>
                      </div>
                    )}
                    
                    {docValidation.confidence && (
                      <div className="mt-3 text-xs opacity-75">
                        <p>Confidence: {docValidation.confidence}</p>
                        {docValidation.extractedCount !== undefined && (
                          <p>Fields Found: {docValidation.extractedCount}/{docValidation.totalFields || 11}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crop Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Crop Diagnosis</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                          currentStep > step ? 'bg-green-500 text-white shadow-green-500/30' :
                          currentStep === step ? 'bg-green-400 text-white animate-pulse shadow-green-400/40' :
                          'bg-gray-700 text-gray-400 shadow-gray-700/20'
                        }`}>
                          {currentStep > step ? '✓' : step}
                        </div>
                        {step < 5 && (
                          <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-500 ${
                            currentStep > step ? 'bg-green-500' : 'bg-gray-700'
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Step {currentStep} of 5</div>
                    <div className="text-xl font-semibold text-green-400 min-h-[28px]">{stepMessage}</div>
                    <div className="text-sm text-gray-500">
                      {currentStep === 1 && 'Analyzing symptoms and classifying problem type...'}
                      {currentStep === 2 && 'Identifying specific disease, pest, or deficiency...'}
                      {currentStep === 3 && 'Assessing severity and potential impact...'}
                      {currentStep === 4 && 'Selecting optimal treatment strategy...'}
                      {currentStep === 5 && 'Generating final recommendations and outcomes...'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <p className="text-green-400 font-semibold text-lg">AI Crop Analysis in Progress</p>
                <p className="text-gray-400 text-sm mt-2">5-step systematic analysis for 90%+ accuracy</p>
              </div>
            )}
            {cropAnalysis && !isAnalyzing && (
              <div className="space-y-8">
                {cropAnalysis.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{cropAnalysis.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-800/50 border border-red-400/30 rounded-[20px] text-center hover:border-red-400/50 transition-all duration-300">
                        <div className={`text-3xl font-bold mb-2 ${
                          cropAnalysis.cropHealth === 'Excellent' ? 'text-green-400' :
                          cropAnalysis.cropHealth === 'Good' ? 'text-green-300' :
                          cropAnalysis.cropHealth === 'Fair' ? 'text-yellow-400' :
                          cropAnalysis.cropHealth === 'Poor' ? 'text-red-400' : 'text-red-500'
                        }`}>
                          {cropAnalysis.cropHealth || 'Good'}
                        </div>
                        <div className="text-gray-300 font-medium">Crop Status</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-blue-400/30 rounded-[20px] text-center hover:border-blue-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          {cropAnalysis.confidence || cropAnalysis.healthScore || 85}%
                        </div>
                        <div className="text-gray-300 font-medium">{cropAnalysis.confidence ? 'AI Confidence' : 'Health Score'}</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-purple-400/30 rounded-[20px] text-center hover:border-purple-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          {cropAnalysis.primaryIssue || cropAnalysis.growthStage || 'Healthy'}
                        </div>
                        <div className="text-gray-300 font-medium">{cropAnalysis.primaryIssue ? 'Primary Issue' : 'Growth Stage'}</div>
                      </div>
                    </div>

                    {/* Primary Issue Alert */}
                    {cropAnalysis.primaryIssue && cropAnalysis.primaryIssue !== 'General Health Check' && (
                      <div className={`p-6 rounded-xl border ${
                        cropAnalysis.primaryIssue.includes('Bacterial') ? 'bg-red-900/20 border-red-500/30' :
                        cropAnalysis.primaryIssue.includes('Fungal') ? 'bg-orange-900/20 border-orange-500/30' :
                        cropAnalysis.primaryIssue.includes('Pest') ? 'bg-yellow-900/20 border-yellow-500/30' :
                        cropAnalysis.primaryIssue.includes('Nutrient') ? 'bg-blue-900/20 border-blue-500/30' :
                        'bg-gray-900/20 border-gray-500/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className={`w-6 h-6 ${
                            cropAnalysis.primaryIssue.includes('Bacterial') ? 'text-red-400' :
                            cropAnalysis.primaryIssue.includes('Fungal') ? 'text-orange-400' :
                            cropAnalysis.primaryIssue.includes('Pest') ? 'text-yellow-400' :
                            cropAnalysis.primaryIssue.includes('Nutrient') ? 'text-blue-400' :
                            'text-gray-400'
                          }`} />
                          <h4 className="text-xl font-bold text-white">Identified Issue: {cropAnalysis.primaryIssue}</h4>
                        </div>
                        {cropAnalysis.overallAssessment && (
                          <p className="text-gray-300">{cropAnalysis.overallAssessment}</p>
                        )}
                      </div>
                    )}

                    {/* Treatment Plan */}
                    {cropAnalysis.treatmentPlan && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-400" />
                          Treatment Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cropAnalysis.treatmentPlan.chemical && (
                            <div>
                              <span className="text-green-400 font-medium">Chemical Treatment:</span>
                              <p className="text-gray-300">{cropAnalysis.treatmentPlan.chemical}</p>
                            </div>
                          )}
                          {cropAnalysis.treatmentPlan.organic && (
                            <div>
                              <span className="text-green-400 font-medium">Organic Alternative:</span>
                              <p className="text-gray-300">{cropAnalysis.treatmentPlan.organic}</p>
                            </div>
                          )}
                          {cropAnalysis.treatmentPlan.frequency && (
                            <div>
                              <span className="text-green-400 font-medium">Application Frequency:</span>
                              <p className="text-gray-300">{cropAnalysis.treatmentPlan.frequency}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Yield Prediction */}
                    {cropAnalysis.yieldPrediction && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                          Yield Prediction
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <span className="text-gray-300">Expected Yield:</span>
                            <div className="font-bold text-blue-400">{cropAnalysis.yieldPrediction.expected}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Quality:</span>
                            <div className="font-bold text-blue-400">{cropAnalysis.yieldPrediction.quality}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Factors:</span>
                            <div className="text-gray-300">{cropAnalysis.yieldPrediction.factors?.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diseases Section */}
                    {cropAnalysis.diseases && cropAnalysis.diseases.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Bug className="w-5 h-5 mr-2 text-red-400" />
                          Detected Diseases
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.diseases.map((disease, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300">
                              <div className="flex justify-between mb-4">
                                <h5 className="text-lg font-bold text-red-400">{disease.name}</h5>
                                <div className="space-x-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    disease.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                                    disease.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                                    disease.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                  }`}>
                                    {disease.severity}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    disease.urgency === 'Immediate' ? 'bg-red-200 text-red-800' :
                                    disease.urgency === 'Within week' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'
                                  }`}>
                                    {disease.urgency}
                                  </span>
                                </div>
                              </div>
                              {disease.symptoms && (
                                <div className="mb-3">
                                  <span className="font-medium text-red-400">Symptoms:</span>
                                  <ul className="list-disc ml-5 text-gray-300">
                                    {disease.symptoms.map((symptom, idx) => (
                                      <li key={idx}>{symptom}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="mb-3">
                                <span className="font-medium text-red-400">Treatment:</span>
                                <p className="text-gray-300">{disease.treatment}</p>
                              </div>
                              <div className="text-gray-300">
                                <span className="font-medium text-red-400">Cost:</span> {disease.cost}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutrition Deficiency */}
                    {cropAnalysis.nutritionDeficiency && cropAnalysis.nutritionDeficiency.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Beaker className="w-5 h-5 mr-2 text-orange-400" />
                          Nutrition Deficiencies
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.nutritionDeficiency.map((deficiency, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300">
                              <h5 className="font-bold text-orange-400 mb-3">{deficiency.nutrient} Deficiency</h5>
                              <div className="mb-3">
                                <span className="font-medium text-orange-400">Symptoms:</span>
                                <ul className="list-disc ml-5 text-gray-300">
                                  {deficiency.symptoms?.map((symptom, idx) => (
                                    <li key={idx}>{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium text-orange-400">Solution:</span>
                                  <p className="text-gray-300">{deficiency.solution}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-400">Dosage:</span>
                                  <p className="text-gray-300">{deficiency.dosage}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fertilizer Recommendations */}
                    {cropAnalysis.fertilizers && cropAnalysis.fertilizers.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-green-400" />
                          Fertilizer Recommendations
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.fertilizers.map((fertilizer, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                              <div className="flex justify-between mb-3">
                                <h5 className="font-bold text-green-400">{fertilizer.name}</h5>
                                <span className="text-sm bg-green-400/20 text-green-400 px-3 py-1 rounded-full">
                                  {fertilizer.purpose}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-300">Quantity:</span>
                                  <div className="font-medium text-green-400">{fertilizer.quantity}</div>
                                </div>
                                <div>
                                  <span className="text-gray-300">Timing:</span>
                                  <div className="font-medium text-green-400">{fertilizer.timing}</div>
                                </div>
                                <div>
                                  <span className="text-gray-300">Cost:</span>
                                  <div className="font-medium text-green-400">{fertilizer.cost}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expected Outcome */}
                    {cropAnalysis.expectedOutcome && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          Expected Outcome
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cropAnalysis.expectedOutcome.recoveryTime && (
                            <div>
                              <span className="text-green-400 font-medium">Recovery Time:</span>
                              <p className="text-gray-300">{cropAnalysis.expectedOutcome.recoveryTime}</p>
                            </div>
                          )}
                          {cropAnalysis.expectedOutcome.successRate && (
                            <div>
                              <span className="text-green-400 font-medium">Success Rate:</span>
                              <p className="text-gray-300">{cropAnalysis.expectedOutcome.successRate}</p>
                            </div>
                          )}
                          {cropAnalysis.expectedOutcome.yieldRecovery && (
                            <div>
                              <span className="text-green-400 font-medium">Yield Recovery:</span>
                              <p className="text-gray-300">{cropAnalysis.expectedOutcome.yieldRecovery}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Plan */}
                    {cropAnalysis.recommendations && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-blue-400" />
                          Action Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cropAnalysis.recommendations.immediate && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30">
                              <h5 className="font-medium text-red-400 mb-3">Immediate Actions</h5>
                              <ul className="space-y-2 text-gray-300">
                                {cropAnalysis.recommendations.immediate.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {cropAnalysis.recommendations.weekly && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-400/30">
                              <h5 className="font-medium text-yellow-400 mb-3">Weekly Actions</h5>
                              <ul className="space-y-2 text-gray-300">
                                {cropAnalysis.recommendations.weekly.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(cropAnalysis.recommendations.monthly || cropAnalysis.recommendations.prevention) && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                              <h5 className="font-medium text-blue-400 mb-3">
                                {cropAnalysis.recommendations.prevention ? 'Prevention' : 'Monthly Actions'}
                              </h5>
                              <ul className="space-y-2 text-gray-300">
                                {(cropAnalysis.recommendations.monthly || cropAnalysis.recommendations.prevention)?.map((action, index) => (
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

                    {/* Cost Analysis */}
                    {cropAnalysis.costAnalysis && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                          Cost-Benefit Analysis
                        </h4>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-2xl font-bold text-red-400">{cropAnalysis.costAnalysis.totalCare}</div>
                            <div className="text-gray-300">Total Care Cost</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-400">{cropAnalysis.costAnalysis.expectedRevenue}</div>
                            <div className="text-gray-300">Expected Revenue</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{cropAnalysis.costAnalysis.profitMargin}</div>
                            <div className="text-gray-300">Profit Margin</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!cropAnalysis && !isAnalyzing && (
              <div className="text-center py-16">
                <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready for AI Diagnosis</h3>
                <p className="text-gray-400 mb-2">Enter crop data and symptoms, then click "Analyze Data" for precise diagnosis</p>
                <p className="text-sm text-gray-500">5-Step Analysis: Symptom Classification → Issue Identification → Severity Assessment → Treatment Selection → Final Recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gray-900 rounded-2xl p-6 border border-green-400/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Plant Disease Scanner</h3>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg bg-gray-800"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(console.error);
                    }
                  }}
                />
                <div className="absolute inset-0 border-2 border-green-400/50 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-green-400"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-400"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-400"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-green-400"></div>
                </div>
              </div>
              <button
                onClick={capturePhoto}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Plant Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captured Image Modal */}
      {capturedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={() => setCapturedImage(null)}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gray-900 rounded-2xl p-6 border border-green-400/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Captured Plant Image</h3>
              <img
                src={capturedImage}
                alt="Captured plant"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => setCapturedImage(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CropHealth;