import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Stethoscope, User, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Loader, Thermometer, Zap } from 'lucide-react'
import { MedicalAI } from '../services/medicalAI'
import CustomDropdown from '../components/CustomDropdown'
import { useTranslation } from 'react-i18next'

const MedicalDiagnosis = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    symptoms: '',
    painDescription: '',
    painLocation: '',
    hasFever: false,
    hasChills: false,
    hasFatigue: false,
    duration: '',
    severity: '',
    medicalHistory: '',
    allergies: '',
    familyHistory: '',
    medications: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const analyzeDiagnosis = async () => {
    setIsAnalyzing(true)
    try {
      // Compile comprehensive symptom data
      const comprehensiveData = {
        ...patientData,
        compiledSymptoms: `
          Main symptoms: ${patientData.symptoms}
          Pain: ${patientData.painDescription} in ${patientData.painLocation}
          Additional symptoms: ${[patientData.hasFever && 'Fever/Chills', patientData.hasFatigue && 'Fatigue'].filter(Boolean).join(', ')}
          Duration: ${patientData.duration}
          Severity: ${patientData.severity}
          Medical History: ${patientData.medicalHistory}
          Allergies: ${patientData.allergies}
          Family History: ${patientData.familyHistory}
        `.trim()
      }
      
      const result = await MedicalAI.comprehensiveDiagnosis(comprehensiveData)
      setDiagnosis(result)
    } catch (error) {
      console.error('Diagnosis error:', error)
      setDiagnosis({
        error: 'AI diagnosis failed. Please check your data and try again.',
        primaryDiagnosis: 'Unknown'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-teal-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-teal-400">Medical</span>AI
          </div>
          <button 
            onClick={() => navigate('/medical-dashboard')}
            className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back_dashboard')}</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 drop-shadow-lg">
            {t('pages.medical_diagnosis.title1')} <br /> {t('pages.medical_diagnosis.title2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t('pages.medical_diagnosis.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Patient Input Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-teal-400/30 shadow-2xl shadow-teal-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-teal-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Stethoscope className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{t('pages.medical_diagnosis.symptom_analysis')}</h3>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) => setPatientData(prev => ({...prev, age: e.target.value}))}
                  placeholder="35"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData(prev => ({...prev, gender: e.target.value}))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Describe Your Symptoms */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">Describe Your Symptoms</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">How are you feeling?</label>
                  <textarea
                    value={patientData.symptoms}
                    onChange={(e) => setPatientData(prev => ({...prev, symptoms: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows="4"
                    placeholder="Describe your symptoms in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pain Description</label>
                    <input
                      type="text"
                      value={patientData.painDescription}
                      onChange={(e) => setPatientData(prev => ({...prev, painDescription: e.target.value}))}
                      placeholder="Sharp, dull, throbbing..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location and Type of Pain</label>
                    <input
                      type="text"
                      value={patientData.painLocation}
                      onChange={(e) => setPatientData(prev => ({...prev, painLocation: e.target.value}))}
                      placeholder="Head, chest, abdomen..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms Checkboxes */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">Additional Symptoms</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-teal-500/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={patientData.hasFever}
                    onChange={(e) => setPatientData(prev => ({...prev, hasFever: e.target.checked}))}
                    className="w-5 h-5 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">Fever/Chills</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-teal-500/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={patientData.hasFatigue}
                    onChange={(e) => setPatientData(prev => ({...prev, hasFatigue: e.target.checked}))}
                    className="w-5 h-5 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Fatigue</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Duration and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <CustomDropdown
                  value={patientData.duration}
                  onChange={(value) => setPatientData(prev => ({...prev, duration: value}))}
                  placeholder="Select duration"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Less than 1 day', label: 'Less than 1 day' },
                    { value: '1-3 days', label: '1-3 days' },
                    { value: '4-7 days', label: '4-7 days' },
                    { value: '1-2 weeks', label: '1-2 weeks' },
                    { value: 'More than 2 weeks', label: 'More than 2 weeks' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                <CustomDropdown
                  value={patientData.severity}
                  onChange={(value) => setPatientData(prev => ({...prev, severity: value}))}
                  placeholder="Select severity"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Mild', label: 'Mild (1-3)' },
                    { value: 'Moderate', label: 'Moderate (4-6)' },
                    { value: 'Severe', label: 'Severe (7-8)' },
                    { value: 'Very Severe', label: 'Very Severe (9-10)' }
                  ]}
                />
              </div>
            </div>

            {/* Medical History */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">Medical History (Optional)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Past diseases/surgeries</label>
                  <input
                    type="text"
                    value={patientData.medicalHistory}
                    onChange={(e) => setPatientData(prev => ({...prev, medicalHistory: e.target.value}))}
                    placeholder="Diabetes, hypertension, surgeries..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Known allergies</label>
                  <input
                    type="text"
                    value={patientData.allergies}
                    onChange={(e) => setPatientData(prev => ({...prev, allergies: e.target.value}))}
                    placeholder="Drug allergies, food allergies..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Family medical history</label>
                  <input
                    type="text"
                    value={patientData.familyHistory}
                    onChange={(e) => setPatientData(prev => ({...prev, familyHistory: e.target.value}))}
                    placeholder="Heart disease, diabetes, cancer..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={analyzeDiagnosis}
              disabled={!patientData.symptoms || isAnalyzing}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{t('common.analyzing')}</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  <span>{t('pages.medical_diagnosis.analyze_symptoms')}</span>
                </>
              )}
            </button>
          </div>

          {/* Diagnosis Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-teal-400/30 shadow-2xl shadow-teal-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-teal-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Diagnosis Results</h3>
            
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
                <p className="text-teal-400 font-medium">Processing medical data...</p>
              </div>
            )}

            {diagnosis && !isAnalyzing && (
              <div className="space-y-8">
                {diagnosis.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{diagnosis.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Primary Diagnosis & Urgency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-teal-400/30">
                        <h4 className="text-lg font-semibold text-teal-400 mb-3">Primary Diagnosis</h4>
                        <p className="text-white font-medium text-xl">{diagnosis.primaryDiagnosis}</p>
                        {diagnosis.confidence && (
                          <p className="text-gray-300 mt-2">Confidence: {diagnosis.confidence}%</p>
                        )}
                      </div>
                      
                      <div className={`p-6 rounded-xl border ${getUrgencyColor(diagnosis.urgency)}`}>
                        <h4 className="font-semibold mb-3">Urgency Level</h4>
                        <div className="flex items-center gap-2">
                          {diagnosis.urgency === 'critical' && <AlertTriangle className="w-5 h-5" />}
                          {diagnosis.urgency === 'high' && <Clock className="w-5 h-5" />}
                          {diagnosis.urgency === 'medium' && <Clock className="w-5 h-5" />}
                          {diagnosis.urgency === 'low' && <CheckCircle className="w-5 h-5" />}
                          <span className="font-medium capitalize">{diagnosis.urgency} Priority</span>
                        </div>
                      </div>
                    </div>

                    {/* Differential Diagnosis */}
                    {diagnosis.differentialDiagnosis && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4">Differential Diagnosis</h4>
                        <div className="space-y-4">
                          {diagnosis.differentialDiagnosis.map((diff, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/30">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-white">{diff.condition}</h5>
                                <span className="text-teal-400 font-bold">{diff.probability}</span>
                              </div>
                              <p className="text-gray-300 text-sm">{diff.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Investigations */}
                    {diagnosis.investigations && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4">Recommended Tests</h4>
                        <div className="space-y-3">
                          {diagnosis.investigations.map((test, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-yellow-400/30">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-white">{test.test}</h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  test.priority === 'high' ? 'bg-red-400/20 text-red-400' :
                                  test.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                                  'bg-green-400/20 text-green-400'
                                }`}>
                                  {test.priority} priority
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">{test.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Treatment Plan */}
                    {diagnosis.treatment && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4">Treatment Plan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {diagnosis.treatment.immediate && (
                            <div className="p-4 bg-red-400/10 rounded-xl border border-red-400/30">
                              <h5 className="font-medium text-red-400 mb-3">Immediate Actions</h5>
                              <ul className="space-y-2">
                                {diagnosis.treatment.immediate.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {diagnosis.treatment.medications && (
                            <div className="p-4 bg-green-400/10 rounded-xl border border-green-400/30">
                              <h5 className="font-medium text-green-400 mb-3">Medications</h5>
                              <div className="space-y-2">
                                {diagnosis.treatment.medications.map((med, index) => (
                                  <div key={index} className="text-gray-300">
                                    <span className="font-medium">{med.name}</span>
                                    {med.dosage && <span className="ml-2 text-sm">- {med.dosage}</span>}
                                    {med.duration && <span className="ml-2 text-sm">({med.duration})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Follow-up */}
                    {diagnosis.followUp && (
                      <div className="p-6 bg-blue-400/10 rounded-xl border border-blue-400/30">
                        <h4 className="text-xl font-semibold text-blue-400 mb-4">Follow-up Care</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-300">Timeframe:</span>
                            <div className="font-medium text-white">{diagnosis.followUp.timeframe}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Monitor:</span>
                            <div className="font-medium text-white">{diagnosis.followUp.monitoring?.join(', ')}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Specialist:</span>
                            <div className="font-medium text-white">{diagnosis.followUp.specialist}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!diagnosis && !isAnalyzing && (
              <div className="text-center py-16 text-teal-600">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">Enter patient symptoms to get AI diagnosis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalDiagnosis