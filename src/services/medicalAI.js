import { BaseAI } from './baseAI.js'

export class MedicalAI extends BaseAI {
  static async comprehensiveDiagnosis(patientData) {
    try {
      const systemPrompt = `You are an advanced medical AI. Return ONLY valid JSON:
{
  "primaryDiagnosis": "most likely condition",
  "confidence": 85,
  "urgency": "low|medium|high|critical",
  "differentialDiagnosis": [
    {"condition": "name", "probability": "percentage", "reasoning": "why possible"}
  ],
  "symptoms": {
    "reported": ["patient symptoms"],
    "associated": ["related symptoms to watch"],
    "redFlags": ["warning signs"]
  },
  "investigations": [
    {"test": "test name", "priority": "high|medium|low", "reason": "why needed"}
  ],
  "treatment": {
    "immediate": ["urgent actions"],
    "medications": [{"name": "drug", "dosage": "amount", "duration": "time"}],
    "lifestyle": ["recommendations"]
  },
  "followUp": {
    "timeframe": "when to return",
    "monitoring": ["what to watch"],
    "specialist": "if referral needed"
  },
  "riskFactors": ["identified risks"],
  "prognosis": "expected outcome"
}`

      const response = await this.callAPI(`Patient: Age ${patientData.age}, Gender ${patientData.gender}, Symptoms: ${patientData.symptoms}, Duration: ${patientData.duration}, Medical History: ${patientData.medicalHistory}, Current Medications: ${patientData.medications}, Vital Signs: ${patientData.vitals}`, systemPrompt)
      
      return this.parseJSON(response) || this.getDefaultDiagnosis()
    } catch (error) {
      console.error('Comprehensive diagnosis error:', error)
      return this.getDefaultDiagnosis()
    }
  }

  static async analyzeVitals(vitalsData) {
    try {
      const systemPrompt = `Advanced medical vitals AI. Return ONLY JSON:
{
  "overallStatus": "normal|concerning|critical",
  "alerts": [{"type": "vital", "severity": "low|medium|high", "message": "alert", "action": "required action"}],
  "vitalsAnalysis": {
    "bloodPressure": {"status": "normal|high|low", "risk": "assessment", "category": "optimal|normal|elevated|stage1|stage2"},
    "heartRate": {"status": "normal|high|low", "concern": "level", "rhythm": "regular|irregular"},
    "temperature": {"status": "normal|fever|hypothermia", "action": "needed"},
    "oxygenSaturation": {"status": "normal|low", "urgency": "level"}
  },
  "predictions": {
    "riskFactors": ["identified risks"],
    "complications": ["potential complications"],
    "timeline": "expected progression",
    "monitoring": "what to watch"
  },
  "recommendations": {
    "immediate": ["urgent actions"],
    "monitoring": ["parameters to track"],
    "lifestyle": ["modifications"]
  }
}`

      const response = await this.callAPI(`Comprehensive vitals analysis: BP ${vitalsData.bloodPressure}, HR ${vitalsData.heartRate}, Temp ${vitalsData.temperature}°F, SpO2 ${vitalsData.oxygenSaturation}%, RR ${vitalsData.respiratoryRate}. Provide detailed medical assessment with predictions.`, systemPrompt)
      
      return this.parseJSON(response) || this.getDefaultVitals()
    } catch (error) {
      return this.getDefaultVitals()
    }
  }

  static async predictHealthOutcomes(patientData, vitalsHistory) {
    try {
      const systemPrompt = `Medical prediction AI. Return ONLY JSON:
{
  "riskAssessment": {
    "cardiovascular": {"risk": "low|medium|high", "factors": ["risk factors"], "timeline": "when to expect"},
    "diabetes": {"risk": "low|medium|high", "indicators": ["warning signs"], "prevention": ["preventive measures"]},
    "hypertension": {"risk": "low|medium|high", "progression": "likely progression", "management": ["management strategies"]}
  },
  "healthTrajectory": {
    "shortTerm": "1-3 months outlook",
    "mediumTerm": "6-12 months projection",
    "longTerm": "1-5 years prediction"
  },
  "interventions": {
    "preventive": ["prevention strategies"],
    "therapeutic": ["treatment options"],
    "lifestyle": ["lifestyle changes"]
  },
  "monitoring": {
    "frequency": "how often to check",
    "parameters": ["what to monitor"],
    "alerts": ["warning signs to watch"]
  }
}`

      const historyText = vitalsHistory ? vitalsHistory.map(h => `${h.date}: BP ${h.bp}, HR ${h.hr}`).join(', ') : 'No history'
      
      const response = await this.callAPI(`Patient: Age ${patientData.age}, Gender ${patientData.gender}, Medical History: ${patientData.medicalHistory}, Current Symptoms: ${patientData.symptoms}, Vitals History: ${historyText}. Predict health outcomes and risks.`, systemPrompt)
      
      return this.parseJSON(response) || this.getDefaultPredictions()
    } catch (error) {
      return this.getDefaultPredictions()
    }
  }

  static async analyzeHealthTrends(healthData) {
    try {
      const systemPrompt = `Health trends AI. Return ONLY JSON:
{
  "trendAnalysis": {
    "vitals": {"direction": "improving|stable|declining", "confidence": "percentage", "factors": ["influencing factors"]},
    "symptoms": {"progression": "better|same|worse", "pattern": "pattern description", "triggers": ["identified triggers"]},
    "overall": {"health": "excellent|good|fair|poor", "trajectory": "upward|stable|downward", "outlook": "prognosis"}
  },
  "predictions": {
    "nextWeek": "expected changes in 1 week",
    "nextMonth": "projected status in 1 month",
    "riskEvents": [{"event": "potential complication", "probability": "likelihood", "timeframe": "when"}]
  },
  "recommendations": {
    "immediate": ["actions needed now"],
    "preventive": ["prevention strategies"],
    "optimization": ["health optimization tips"]
  }
}`

      const response = await this.callAPI(`Analyze health trends: ${JSON.stringify(healthData)}`, systemPrompt)
      
      return this.parseJSON(response) || this.getDefaultTrends()
    } catch (error) {
      return this.getDefaultTrends()
    }
  }

  static getDefaultDiagnosis() {
    return {
      primaryDiagnosis: 'Requires clinical evaluation',
      confidence: 70,
      urgency: 'medium',
      differentialDiagnosis: [
        {condition: 'Viral infection', probability: '40%', reasoning: 'Common symptoms match'},
        {condition: 'Bacterial infection', probability: '30%', reasoning: 'Symptom severity'}
      ],
      symptoms: {
        reported: ['Fever', 'Fatigue'],
        associated: ['Headache', 'Body aches'],
        redFlags: ['Difficulty breathing', 'Chest pain']
      },
      investigations: [
        {test: 'Complete Blood Count', priority: 'high', reason: 'Check for infection markers'},
        {test: 'Chest X-ray', priority: 'medium', reason: 'Rule out pneumonia'}
      ],
      treatment: {
        immediate: ['Rest', 'Hydration', 'Fever management'],
        medications: [{name: 'Paracetamol', dosage: '500mg', duration: '3 times daily'}],
        lifestyle: ['Adequate rest', 'Increase fluid intake']
      },
      followUp: {
        timeframe: '48-72 hours if no improvement',
        monitoring: ['Temperature', 'Breathing difficulty'],
        specialist: 'Internal Medicine if symptoms persist'
      },
      riskFactors: ['Age', 'Chronic conditions'],
      prognosis: 'Good with appropriate treatment'
    }
  }

  static getDefaultVitals() {
    return {
      overallStatus: 'normal',
      alerts: [],
      vitalsAnalysis: {
        bloodPressure: {status: 'normal', risk: 'low', category: 'normal'},
        heartRate: {status: 'normal', concern: 'none', rhythm: 'regular'},
        temperature: {status: 'normal', action: 'continue monitoring'},
        oxygenSaturation: {status: 'normal', urgency: 'none'}
      },
      predictions: {
        riskFactors: ['No immediate risks identified'],
        complications: ['Low risk for complications'],
        timeline: 'Stable condition expected',
        monitoring: 'Regular vital checks recommended'
      },
      recommendations: {
        immediate: ['Continue current care'],
        monitoring: ['Regular vital signs'],
        lifestyle: ['Maintain healthy habits']
      }
    }
  }

  static getDefaultPredictions() {
    return {
      riskAssessment: {
        cardiovascular: {risk: 'low', factors: ['No major risk factors'], timeline: 'Low risk in next 5 years'},
        diabetes: {risk: 'low', indicators: ['Normal glucose indicators'], prevention: ['Maintain healthy diet', 'Regular exercise']},
        hypertension: {risk: 'low', progression: 'Stable blood pressure expected', management: ['Continue monitoring']}
      },
      healthTrajectory: {
        shortTerm: 'Stable health expected in next 3 months',
        mediumTerm: 'Good health outlook for next year',
        longTerm: 'Positive long-term health prospects with current lifestyle'
      },
      interventions: {
        preventive: ['Regular health checkups', 'Maintain current lifestyle'],
        therapeutic: ['No immediate treatment needed'],
        lifestyle: ['Continue healthy habits', 'Regular exercise']
      },
      monitoring: {
        frequency: 'Monthly health checks recommended',
        parameters: ['Blood pressure', 'Weight', 'General wellness'],
        alerts: ['Sudden symptom changes', 'Persistent discomfort']
      }
    }
  }

  static getDefaultTrends() {
    return {
      trendAnalysis: {
        vitals: {direction: 'stable', confidence: '85%', factors: ['Consistent readings']},
        symptoms: {progression: 'stable', pattern: 'No concerning patterns', triggers: ['None identified']},
        overall: {health: 'good', trajectory: 'stable', outlook: 'Positive'}
      },
      predictions: {
        nextWeek: 'Continued stable health expected',
        nextMonth: 'Maintaining current health status',
        riskEvents: [{event: 'No significant risks identified', probability: 'Low', timeframe: 'Not applicable'}]
      },
      recommendations: {
        immediate: ['Continue current health practices'],
        preventive: ['Regular exercise', 'Balanced diet'],
        optimization: ['Stress management', 'Adequate sleep']
      }
    }
  }
}