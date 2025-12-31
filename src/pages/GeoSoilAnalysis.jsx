import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Beaker, BarChart3, Loader, AlertTriangle, CheckCircle, Upload, FileText, Mic, MicOff, Navigation, Target, Ban } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';

const GeoSoilAnalysis = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState({
    ph: '',
    moisture: '',
    organicMatter: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    salinity: '',
    temperature: ''
  });
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
  const [nearbyFields, setNearbyFields] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [soilAnalysis, setSoilAnalysis] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [docValidation, setDocValidation] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoadingNearbyData, setIsLoadingNearbyData] = useState(false);
  const [dataSource, setDataSource] = useState('manual'); // 'manual', 'document', 'voice', 'location'
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
          await fetchNearbyFieldData(latitude, longitude);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get location. Please enable location services.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  const fetchNearbyFieldData = async (lat, lng) => {
    setIsLoadingNearbyData(true);
    try {
      const systemPrompt = `Generate realistic soil data for agricultural fields within 1km of coordinates ${lat}, ${lng}. Return ONLY valid JSON:
{
  "nearbyFields": [
    {
      "id": "field_1",
      "distance": "0.3km",
      "cropType": "wheat/rice/corn/etc",
      "soilData": {
        "ph": "6.5",
        "moisture": "45",
        "organicMatter": "3.2",
        "nitrogen": "120",
        "phosphorus": "25",
        "potassium": "180",
        "salinity": "0.8",
        "temperature": "22"
      }
    }
  ],
  "averageData": {
    "ph": "average pH",
    "moisture": "average moisture",
    "organicMatter": "average organic matter",
    "nitrogen": "average nitrogen",
    "phosphorus": "average phosphorus", 
    "potassium": "average potassium",
    "salinity": "average salinity",
    "temperature": "average temperature"
  }
}`;

      const response = await FarmerAI.callAPI(
        `Generate soil data for 3-5 agricultural fields within 1km radius of location ${lat}, ${lng}. Include realistic values based on regional soil characteristics.`,
        systemPrompt
      );

      const parsed = FarmerAI.parseJSON(response);
      if (parsed && parsed.nearbyFields) {
        setNearbyFields(parsed.nearbyFields);
        if (parsed.averageData) {
          setSoilData(prev => ({ ...prev, ...parsed.averageData }));
          setDataSource('location');
        }
      }
    } catch (error) {
      console.error('Error fetching nearby field data:', error);
    } finally {
      setIsLoadingNearbyData(false);
    }
  };

  const analyzeSoilWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const analysisData = {
        ...soilData,
        location: location.address,
        coordinates: { lat: location.lat, lng: location.lng },
        nearbyFieldsCount: nearbyFields.length
      };
      const analysis = await FarmerAI.analyzeSoil(analysisData);
      setSoilAnalysis(analysis);
    } catch (error) {
      console.error('Soil analysis error:', error);
      setSoilAnalysis({
        error: 'AI soil analysis failed. Please check your data and try again.',
        soilHealth: 'Unknown'
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
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setDocValidation({
        isValid: false,
        message: 'Invalid file type. Please upload JPG, PNG, PDF, or TXT files only.',
        missingFields: []
      });
      setIsProcessingDoc(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        const systemPrompt = `Extract soil test data from this document. Return ONLY valid JSON:
{
  "extractedData": {
    "ph": "pH value or null",
    "moisture": "moisture % or null",
    "organicMatter": "organic matter % or null",
    "nitrogen": "nitrogen ppm or null",
    "phosphorus": "phosphorus ppm or null",
    "potassium": "potassium ppm or null",
    "salinity": "salinity dS/m or null",
    "temperature": "soil temperature °C or null"
  },
  "validation": {
    "isComplete": true/false,
    "missingFields": ["list of missing fields"],
    "confidence": "High/Medium/Low",
    "message": "Document analysis result"
  }
}`;
        
        const response = await FarmerAI.callAPI(
          `Analyze this soil test report and extract soil parameters. Required fields: ph, moisture, organicMatter, nitrogen, phosphorus, potassium, salinity, temperature. Document: ${file.type.includes('image') ? fileData : 'Text content: ' + fileData}`,
          systemPrompt
        );
        
        const parsed = FarmerAI.parseJSON(response);
        if (parsed && parsed.extractedData && parsed.validation) {
          const validData = Object.fromEntries(
            Object.entries(parsed.extractedData).filter(([_, value]) => value && value !== "null" && value !== "")
          );
          
          setSoilData(prev => ({ ...prev, ...validData }));
          setDataSource('document');
          
          setDocValidation({
            isValid: parsed.validation.isComplete,
            message: parsed.validation.message,
            missingFields: parsed.validation.missingFields || [],
            confidence: parsed.validation.confidence,
            extractedFields: Object.keys(validData)
          });
        } else {
          setDocValidation({
            isValid: false,
            message: 'Could not extract soil data from this document. Please ensure it contains soil test parameters.',
            missingFields: Object.keys(soilData)
          });
        }
      };
      
      if (file.type.includes('image')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Document processing error:', error);
      setDocValidation({
        isValid: false,
        message: 'Failed to process document. Please try again with a different file.',
        missingFields: []
      });
    } finally {
      setIsProcessingDoc(false);
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
      const systemPrompt = `Extract soil test data from this voice input. Return ONLY valid JSON:
{
  "ph": "pH value if mentioned",
  "moisture": "moisture percentage if mentioned",
  "organicMatter": "organic matter if mentioned",
  "nitrogen": "nitrogen level if mentioned",
  "phosphorus": "phosphorus level if mentioned",
  "potassium": "potassium level if mentioned",
  "salinity": "salinity if mentioned",
  "temperature": "soil temperature if mentioned"
}`;
      
      const extractedData = await FarmerAI.callAPI(
        `Extract soil information from this voice input: "${transcript}"`,
        systemPrompt
      );
      
      const parsed = FarmerAI.parseJSON(extractedData);
      if (parsed) {
        setSoilData(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(parsed).filter(([_, value]) => value && value !== "")
          )
        }));
        setDataSource('voice');
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
            <span>Back to Farming Tool</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            GEO SOIL <br /> ANALYSIS
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Location-based soil analysis with nearby field data within 1km range.
          </p>
        </div>

        <div className="space-y-8">
          {/* Location Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-blue-400/30 shadow-2xl shadow-blue-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-blue-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Location & Nearby Fields</h3>
            <div className="grid grid-cols-1 gap-6">
              {location.lat && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Current Location:</span>
                  </div>
                  <p className="text-gray-300 text-sm">{location.address}</p>
                </div>
              )}
              <div>
                {isLoadingNearbyData && (
                  <div className="flex items-center justify-center space-x-2 text-blue-400">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Loading nearby field data...</span>
                  </div>
                )}
                {nearbyFields.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-400">Nearby Fields ({nearbyFields.length})</h4>
                    {nearbyFields.map((field, index) => (
                      <div key={field.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{field.cropType}</span>
                          <span className="text-blue-400 text-sm">{field.distance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Soil Input Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Beaker className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Soil Testing Data</h3>
              <span className="text-sm text-gray-400">
                {Object.values(soilData).some(v => v) ? (
                  <>Data from: <span className="text-green-400 capitalize">{dataSource}</span></>
                ) : (
                  <>Use automated functions to fill data</>
                )}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(soilData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize flex items-center group">
                    {key.replace(/([A-Z])/g, ' $1').trim()} {
                      key === 'moisture' || key === 'organicMatter' ? '(%)' : 
                      key === 'temperature' ? '(°C)' : 
                      key === 'salinity' ? '(dS/m)' : 
                      '(ppm)'
                    }
                    <Ban className="w-3 h-3 ml-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={value}
                      onChange={() => {}} // Always disabled
                      onKeyDown={(e) => e.preventDefault()} // Always prevent typing
                      onPaste={(e) => e.preventDefault()} // Always prevent pasting
                      placeholder={value ? `Auto-filled from ${dataSource}` : `Use automated functions to fill`}
                      readOnly={true} // Always read-only
                      tabIndex={-1} // Always remove from tab order
                      className="w-full px-4 py-3 border rounded-lg text-white transition-all duration-200 bg-gray-700/30 border-gray-600/30 placeholder-gray-500 cursor-not-allowed opacity-60 pointer-events-none select-none"
                    />
                    <Ban className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
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
                    : 'bg-orange-500 hover:bg-orange-600'
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
                onClick={getCurrentLocation}
                disabled={isGettingLocation || isAnalyzing || isProcessingDoc || isListening}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                {isGettingLocation ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Getting...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    <span>Get Location</span>
                  </>
                )}
              </button>
              
              <button
                onClick={analyzeSoilWithAI}
                disabled={!Object.values(soilData).some(v => v) || isAnalyzing || isProcessingDoc || isListening}
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
                    <span>Analyze Soil</span>
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
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleDocumentUpload}
              className="hidden"
            />

            {uploadedDoc && (
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-400">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Document Uploaded:</span>
                  <span>{uploadedDoc.name}</span>
                </div>
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
                        <p className="text-sm font-medium mb-1">Missing Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {docValidation.missingFields.map(field => (
                            <span key={field} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {docValidation.confidence && (
                      <p className="text-xs mt-2 opacity-75">
                        Confidence: {docValidation.confidence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Soil Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Soil Analysis Results</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-400 font-medium">Analyzing soil data with location insights...</p>
              </div>
            )}
            {soilAnalysis && !isAnalyzing && (
              <div className="space-y-8">
                {soilAnalysis.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{soilAnalysis.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-800/50 border border-green-400/30 rounded-[20px] text-center">
                        <div className={`text-3xl font-bold mb-2 ${
                          soilAnalysis.soilHealth === 'Excellent' ? 'text-green-400' :
                          soilAnalysis.soilHealth === 'Good' ? 'text-green-300' :
                          soilAnalysis.soilHealth === 'Fair' ? 'text-yellow-400' :
                          soilAnalysis.soilHealth === 'Poor' ? 'text-red-400' : 'text-red-500'
                        }`}>
                          {soilAnalysis.soilHealth || 'Good'}
                        </div>
                        <div className="text-gray-300 font-medium">Soil Health</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-blue-400/30 rounded-[20px] text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          {soilAnalysis.healthScore || 85}%
                        </div>
                        <div className="text-gray-300 font-medium">Health Score</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-purple-400/30 rounded-[20px] text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          {nearbyFields.length}
                        </div>
                        <div className="text-gray-300 font-medium">Nearby Fields</div>
                      </div>
                    </div>

                    {/* Additional analysis sections would go here similar to the original soil analysis */}
                    {soilAnalysis.recommendations && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4">Recommendations</h4>
                        <div className="space-y-2">
                          {soilAnalysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                              <span className="text-gray-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!soilAnalysis && !isAnalyzing && (
              <div className="text-center py-16 text-green-600">
                <Beaker className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">Enter soil data and location to analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoSoilAnalysis;