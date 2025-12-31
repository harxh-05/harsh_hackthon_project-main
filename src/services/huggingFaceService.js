import { BaseAI } from './baseAI.js';
import { sanitizeObject } from '../utils/sanitize.js';

export class FarmerAI extends BaseAI {
  static sanitizeInputData(data) {
    return sanitizeObject(data);
  }
  static async analyzeCrop(cropData, onStepUpdate = null) {
    try {
      const sanitizedData = this.sanitizeInputData(cropData);
      
      // Step 1: Symptom Classification
      onStepUpdate?.(1, 'Analyzing symptoms and classifying problem type...');
      const symptomAnalysis = await this.analyzeSymptoms(sanitizedData);
      
      // Step 2: Disease/Pest Identification
      onStepUpdate?.(2, 'Identifying specific disease, pest, or deficiency...');
      const identification = await this.identifyIssue(sanitizedData, symptomAnalysis);
      
      // Step 3: Severity Assessment
      onStepUpdate?.(3, 'Assessing severity and potential impact...');
      const severityAssessment = await this.assessSeverity(sanitizedData, identification);
      
      // Step 4: Treatment Selection
      onStepUpdate?.(4, 'Selecting optimal treatment strategy...');
      const treatmentPlan = await this.selectTreatment(sanitizedData, identification, severityAssessment);
      
      // Step 5: Final Recommendations
      onStepUpdate?.(5, 'Generating final recommendations and outcomes...');
      const finalAnalysis = await this.generateFinalRecommendations(sanitizedData, {
        symptoms: symptomAnalysis,
        identification,
        severity: severityAssessment,
        treatment: treatmentPlan
      });
      
      return finalAnalysis || this.getDefaultCropAnalysis();
    } catch (error) {
      console.error('FarmerAI: Crop analysis error:', error);
      return this.getDefaultCropAnalysis();
    }
  }

  static async analyzeSymptoms(cropData) {
    const systemPrompt = `You are a plant pathologist. Analyze symptoms and classify the problem type. Return ONLY valid JSON:
{
  "problemType": "Bacterial Disease|Fungal Disease|Pest Infestation|Nutrient Deficiency|Viral Disease|Environmental Stress|Healthy",
  "confidence": 85,
  "keySymptoms": ["primary symptoms observed"],
  "affectedParts": ["leaves|stems|roots|fruits"],
  "pattern": "localized|widespread|progressive|random",
  "urgency": "Immediate|Within week|Monitor|Routine"
}`;

    const response = await this.callAPI(`SYMPTOM ANALYSIS:
Crop: ${cropData.cropType}
Symptoms: ${cropData.symptoms || 'No specific symptoms'}
Growth Stage: ${cropData.growthStage}
Weather: ${cropData.weatherConditions}

Classify the problem type based on symptoms.`, systemPrompt);
    
    return this.parseJSON(response) || {problemType: 'Healthy', confidence: 50};
  }

  static async identifyIssue(cropData, symptomAnalysis) {
    const systemPrompt = `You are a crop disease specialist. Identify the specific issue. Return ONLY valid JSON:
{
  "specificIssue": "exact disease/pest name",
  "scientificName": "scientific name if applicable",
  "commonNames": ["alternative names"],
  "causativeAgent": "bacteria|fungus|virus|insect|mite|deficiency",
  "transmissionMode": "airborne|soilborne|insect-vector|contact",
  "riskFactors": ["conditions that worsen the problem"]
}`;

    const response = await this.callAPI(`ISSUE IDENTIFICATION:
Crop: ${cropData.cropType}
Problem Type: ${symptomAnalysis.problemType}
Symptoms: ${symptomAnalysis.keySymptoms?.join(', ')}
Location: ${cropData.location}
Weather: ${cropData.weatherConditions}

Identify the specific disease, pest, or deficiency.`, systemPrompt);
    
    return this.parseJSON(response) || {specificIssue: 'Unknown', causativeAgent: 'unknown'};
  }

  static async assessSeverity(cropData, identification) {
    const systemPrompt = `You are a crop damage assessor. Evaluate severity and impact. Return ONLY valid JSON:
{
  "severityLevel": "Low|Medium|High|Critical",
  "affectedPercentage": 25,
  "spreadRate": "Slow|Moderate|Fast|Very Fast",
  "yieldImpact": "5-15%|15-30%|30-60%|60%+",
  "economicLoss": "₹2000-5000|₹5000-15000|₹15000-30000|₹30000+",
  "timeToAction": "24 hours|3-7 days|1-2 weeks|Monitor"
}`;

    const response = await this.callAPI(`SEVERITY ASSESSMENT:
Crop: ${cropData.cropType}
Field Size: ${cropData.fieldSize} acres
Issue: ${identification.specificIssue}
Symptoms Pattern: ${cropData.symptoms}
Current Treatments: ${cropData.fertilizer || 'none'}, ${cropData.pesticide || 'none'}

Assess the severity and potential impact.`, systemPrompt);
    
    return this.parseJSON(response) || {severityLevel: 'Medium', affectedPercentage: 20};
  }

  static async selectTreatment(cropData, identification, severity) {
    const systemPrompt = `You are a crop treatment specialist. Select optimal treatment. Return ONLY valid JSON:
{
  "primaryTreatment": "specific treatment method",
  "activeIngredient": "chemical/biological agent",
  "dosage": "application rate",
  "applicationMethod": "spray|drench|granular|injection",
  "frequency": "application schedule",
  "alternativeTreatment": "organic/biological option",
  "cost": "₹800-1500",
  "effectiveness": "85-95%|70-85%|60-75%|<60%"
}`;

    const response = await this.callAPI(`TREATMENT SELECTION:
Issue: ${identification.specificIssue}
Causative Agent: ${identification.causativeAgent}
Severity: ${severity.severityLevel}
Field Size: ${cropData.fieldSize} acres
Urgency: ${severity.timeToAction}

Select the most effective treatment for this specific issue.`, systemPrompt);
    
    return this.parseJSON(response) || {primaryTreatment: 'General fungicide', cost: '₹1000'};
  }

  static async generateFinalRecommendations(cropData, analysisSteps) {
    const systemPrompt = `You are a senior agricultural consultant. Provide final recommendations. Return ONLY valid JSON:
{
  "cropHealth": "Excellent|Good|Fair|Poor|Critical",
  "healthScore": 75,
  "primaryIssue": "${analysisSteps.identification.specificIssue}",
  "confidence": 90,
  "diseases": [{
    "name": "${analysisSteps.identification.specificIssue}",
    "type": "${analysisSteps.identification.causativeAgent}",
    "severity": "${analysisSteps.severity.severityLevel}",
    "symptoms": ${JSON.stringify(analysisSteps.symptoms.keySymptoms || [])},
    "treatment": "${analysisSteps.treatment.primaryTreatment}",
    "cost": "${analysisSteps.treatment.cost}",
    "urgency": "${analysisSteps.symptoms.urgency}"
  }],
  "treatmentPlan": {
    "chemical": "${analysisSteps.treatment.activeIngredient} @ ${analysisSteps.treatment.dosage}",
    "organic": "${analysisSteps.treatment.alternativeTreatment}",
    "frequency": "${analysisSteps.treatment.frequency}"
  },
  "recommendations": {
    "immediate": ["Apply ${analysisSteps.treatment.primaryTreatment}", "Monitor spread", "Improve conditions"],
    "weekly": ["Check treatment effectiveness", "Repeat if needed"],
    "prevention": ["Use resistant varieties", "Improve field hygiene"]
  },
  "expectedOutcome": {
    "recoveryTime": "1-3 weeks|3-6 weeks|6-12 weeks",
    "successRate": "${analysisSteps.treatment.effectiveness}",
    "yieldRecovery": "Full recovery|80-90%|60-80%|<60%"
  }
}`;

    const response = await this.callAPI(`FINAL RECOMMENDATIONS:
Crop: ${cropData.cropType}
Analysis Summary:
- Problem: ${analysisSteps.identification.specificIssue}
- Severity: ${analysisSteps.severity.severityLevel}
- Treatment: ${analysisSteps.treatment.primaryTreatment}
- Confidence: ${analysisSteps.symptoms.confidence}%

Provide comprehensive final recommendations.`, systemPrompt);
    
    return this.parseJSON(response) || this.getDefaultCropAnalysis();
  }

  static determineAnalysisType(symptoms) {
    if (!symptoms) return 'general';
    
    const symptomText = symptoms.toLowerCase();
    
    if (symptomText.includes('bacterial') || symptomText.includes('blight') || 
        symptomText.includes('canker') || symptomText.includes('soft rot') ||
        symptomText.includes('water-soaked') || symptomText.includes('ooze')) {
      return 'bacterial';
    }
    
    if (symptomText.includes('fungal') || symptomText.includes('mold') || 
        symptomText.includes('rust') || symptomText.includes('mildew') ||
        symptomText.includes('spot') || symptomText.includes('wilt')) {
      return 'fungal';
    }
    
    if (symptomText.includes('pest') || symptomText.includes('insect') || 
        symptomText.includes('caterpillar') || symptomText.includes('aphid') ||
        symptomText.includes('holes') || symptomText.includes('chewed')) {
      return 'pest';
    }
    
    if (symptomText.includes('yellow') || symptomText.includes('chlorosis') || 
        symptomText.includes('deficiency') || symptomText.includes('stunted') ||
        symptomText.includes('purple') || symptomText.includes('pale')) {
      return 'nutrient';
    }
    
    return 'general';
  }

  static getSystemPromptForType(type) {
    switch (type) {
      case 'bacterial':
        return `{
  "cropHealth": "Poor|Critical",
  "healthScore": 40,
  "primaryIssue": "Bacterial Disease",
  "diseases": [{
    "name": "specific bacterial disease",
    "type": "Bacterial",
    "severity": "Medium|High|Critical",
    "symptoms": ["observed symptoms"],
    "treatment": "copper-based bactericide or antibiotic spray",
    "cost": "₹800-1500",
    "urgency": "Immediate"
  }],
  "recommendations": {
    "immediate": ["Apply copper sulfate spray", "Remove infected plants", "Improve drainage"],
    "weekly": ["Monitor spread", "Repeat treatment if needed"],
    "prevention": ["Use disease-free seeds", "Crop rotation"]
  },
  "treatmentPlan": {
    "chemical": "Copper oxychloride 50% WP @ 3g/L",
    "organic": "Neem oil + copper sulfate",
    "frequency": "Every 7-10 days until controlled"
  }
}`;
      
      case 'fungal':
        return `{
  "cropHealth": "Fair|Poor",
  "healthScore": 50,
  "primaryIssue": "Fungal Disease",
  "diseases": [{
    "name": "specific fungal disease",
    "type": "Fungal",
    "severity": "Low|Medium|High",
    "symptoms": ["observed symptoms"],
    "treatment": "systemic fungicide spray",
    "cost": "₹600-1200",
    "urgency": "Within week"
  }],
  "recommendations": {
    "immediate": ["Apply fungicide", "Improve air circulation", "Reduce humidity"],
    "weekly": ["Monitor disease progress", "Adjust irrigation"],
    "prevention": ["Resistant varieties", "Proper spacing"]
  },
  "treatmentPlan": {
    "chemical": "Propiconazole 25% EC @ 1ml/L",
    "organic": "Trichoderma + neem oil",
    "frequency": "Every 10-14 days"
  }
}`;
      
      case 'pest':
        return `{
  "cropHealth": "Good|Fair",
  "healthScore": 65,
  "primaryIssue": "Pest Infestation",
  "pests": [{
    "name": "specific pest",
    "type": "Insect|Mite|Nematode",
    "damage": "damage description",
    "severity": "Low|Medium|High",
    "control": "targeted pesticide or biological control",
    "cost": "₹400-800"
  }],
  "recommendations": {
    "immediate": ["Apply targeted pesticide", "Remove affected parts", "Install traps"],
    "weekly": ["Monitor pest population", "Check trap catches"],
    "prevention": ["Beneficial insects", "Crop rotation"]
  },
  "treatmentPlan": {
    "chemical": "Specific insecticide based on pest",
    "biological": "Predatory insects or parasites",
    "frequency": "As needed based on threshold"
  }
}`;
      
      case 'nutrient':
        return `{
  "cropHealth": "Fair|Good",
  "healthScore": 60,
  "primaryIssue": "Nutrient Deficiency",
  "nutritionDeficiency": [{
    "nutrient": "N|P|K|Mg|Fe|Zn",
    "symptoms": ["deficiency symptoms"],
    "solution": "specific fertilizer recommendation",
    "dosage": "application rate per acre"
  }],
  "fertilizers": [{
    "name": "specific fertilizer",
    "quantity": "kg per acre",
    "timing": "application timing",
    "cost": "₹1000-2000",
    "purpose": "nutrient correction"
  }],
  "recommendations": {
    "immediate": ["Apply deficient nutrient", "Soil test", "Foliar spray"],
    "weekly": ["Monitor plant response", "Adjust fertilization"],
    "longterm": ["Soil amendment", "Organic matter addition"]
  }
}`;
      
      default:
        return `{
  "cropHealth": "Good|Fair|Poor",
  "healthScore": 75,
  "growthStage": "current stage analysis",
  "yieldPrediction": {"expected": "yield estimate", "quality": "High|Medium|Low"},
  "diseases": [],
  "pests": [],
  "nutritionDeficiency": [],
  "recommendations": {
    "immediate": ["general care actions"],
    "weekly": ["monitoring tasks"],
    "monthly": ["long-term care"]
  },
  "overallAssessment": "comprehensive health status"
}`;
    }
  }

  static async analyzeSoil(soilSample, onStepUpdate = null) {
    try {
      const sanitizedSample = this.sanitizeInputData(soilSample);
      
      // Step 1: Soil Composition Analysis
      onStepUpdate?.(1, 'Analyzing soil composition and physical properties...');
      const compositionAnalysis = await this.analyzeSoilComposition(sanitizedSample);
      
      // Step 2: Chemical Properties Assessment
      onStepUpdate?.(2, 'Evaluating pH, nutrients, and chemical balance...');
      const chemicalAnalysis = await this.assessChemicalProperties(sanitizedSample, compositionAnalysis);
      
      // Step 3: Fertility and Health Evaluation
      onStepUpdate?.(3, 'Determining soil fertility and health status...');
      const fertilityAssessment = await this.evaluateSoilFertility(sanitizedSample, chemicalAnalysis);
      
      // Step 4: Crop Suitability Analysis
      onStepUpdate?.(4, 'Identifying suitable crops and profitability...');
      const cropSuitability = await this.analyzeCropSuitability(sanitizedSample, fertilityAssessment);
      
      // Step 5: Final Recommendations
      onStepUpdate?.(5, 'Generating comprehensive soil management plan...');
      const finalAnalysis = await this.generateSoilRecommendations(sanitizedSample, {
        composition: compositionAnalysis,
        chemical: chemicalAnalysis,
        fertility: fertilityAssessment,
        crops: cropSuitability
      });
      
      return finalAnalysis || this.getDefaultSoilAnalysis();
    } catch (error) {
      console.error('FarmerAI: Soil analysis error:', error);
      return this.getDefaultSoilAnalysis();
    }
  }

  static async analyzeSoilComposition(soilData) {
    const systemPrompt = `You are a soil physicist. Analyze soil composition and structure. Return ONLY valid JSON:
{
  "soilTexture": "Clay|Loam|Sandy|Silt",
  "structure": "Granular|Blocky|Platy|Massive",
  "porosity": "High|Medium|Low",
  "drainage": "Excellent|Good|Poor|Very Poor",
  "compaction": "None|Light|Moderate|Severe",
  "organicMatter": "High|Medium|Low",
  "waterHoldingCapacity": "High|Medium|Low"
}`;

    const response = await this.callAPI(`SOIL COMPOSITION ANALYSIS:
Moisture: ${soilData.moisture}%
Organic Matter: ${soilData.organicMatter}%
Temperature: ${soilData.temperature}°C
Salinity: ${soilData.salinity} dS/m

Analyze soil physical properties and structure.`, systemPrompt);
    
    return this.parseJSON(response) || {soilTexture: 'Loam', drainage: 'Good', organicMatter: 'Medium'};
  }

  static async assessChemicalProperties(soilData, composition) {
    const systemPrompt = `You are a soil chemist. Assess chemical properties and nutrient status. Return ONLY valid JSON:
{
  "pHCategory": "Highly Acidic|Acidic|Slightly Acidic|Neutral|Slightly Alkaline|Alkaline|Highly Alkaline",
  "pHImpact": "nutrient availability impact",
  "nutrientStatus": {
    "nitrogen": {"level": "High|Medium|Low", "availability": "Good|Fair|Poor"},
    "phosphorus": {"level": "High|Medium|Low", "availability": "Good|Fair|Poor"},
    "potassium": {"level": "High|Medium|Low", "availability": "Good|Fair|Poor"}
  },
  "salinityImpact": "None|Slight|Moderate|Severe",
  "cationExchangeCapacity": "High|Medium|Low",
  "micronutrients": "Adequate|Deficient|Toxic"
}`;

    const response = await this.callAPI(`CHEMICAL PROPERTIES ASSESSMENT:
PH: ${soilData.ph}
Nitrogen: ${soilData.nitrogen} ppm
Phosphorus: ${soilData.phosphorus} ppm
Potassium: ${soilData.potassium} ppm
Salinity: ${soilData.salinity} dS/m
Soil Type: ${composition.soilTexture}

Evaluate chemical balance and nutrient availability.`, systemPrompt);
    
    return this.parseJSON(response) || {pHCategory: 'Neutral', nutrientStatus: {nitrogen: {level: 'Medium'}, phosphorus: {level: 'Medium'}, potassium: {level: 'Medium'}}};
  }

  static async evaluateSoilFertility(soilData, chemical) {
    const systemPrompt = `You are a soil fertility expert. Evaluate overall fertility and health. Return ONLY valid JSON:
{
  "fertilityRating": "Excellent|Good|Fair|Poor|Very Poor",
  "healthScore": 85,
  "limitingFactors": ["factors limiting productivity"],
  "strengths": ["soil advantages"],
  "biologicalActivity": "High|Medium|Low",
  "sustainabilityIndex": "High|Medium|Low",
  "improvementPotential": "High|Medium|Low"
}`;

    const response = await this.callAPI(`FERTILITY EVALUATION:
PH Category: ${chemical.pHCategory}
Nutrient Status: N-${chemical.nutrientStatus?.nitrogen?.level}, P-${chemical.nutrientStatus?.phosphorus?.level}, K-${chemical.nutrientStatus?.potassium?.level}
Organic Matter: ${soilData.organicMatter}%
Salinity Impact: ${chemical.salinityImpact}

Evaluate overall soil fertility and health status.`, systemPrompt);
    
    return this.parseJSON(response) || {fertilityRating: 'Good', healthScore: 75, limitingFactors: ['pH adjustment needed']};
  }

  static async analyzeCropSuitability(soilData, fertility) {
    const systemPrompt = `You are a crop-soil compatibility expert. Identify suitable crops. Return ONLY valid JSON:
{
  "suitableCrops": [
    {
      "name": "crop name",
      "suitabilityScore": 90,
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "₹15-25k/acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High",
      "waterRequirement": "High|Medium|Low",
      "soilMatch": "why this crop suits the soil"
    }
  ],
  "avoidCrops": ["crops to avoid with reasons"]
}`;

    const response = await this.callAPI(`CROP SUITABILITY ANALYSIS:
Fertility Rating: ${fertility.fertilityRating}
Health Score: ${fertility.healthScore}
PH: ${soilData.ph}
Nutrients: N-${soilData.nitrogen}ppm, P-${soilData.phosphorus}ppm, K-${soilData.potassium}ppm
Moisture: ${soilData.moisture}%

Identify 5 most suitable and profitable crops for these soil conditions.`, systemPrompt);
    
    return this.parseJSON(response) || {suitableCrops: [{name: 'Wheat', suitabilityScore: 85, profitLevel: 'High Profit'}]};
  }

  static generateFinalReport(soilData, analysis) {
    const { direct, classification, problems, treatments } = analysis;
    const { values, pHCategory, nLevel, pLevel, kLevel, salinityLevel, omLevel } = classification;
    
    // Calculate health score scientifically
    let healthScore = 100;
    if (values.ph < 5.5 || values.ph > 8.5) healthScore -= 30;
    else if (values.ph < 6.0 || values.ph > 8.0) healthScore -= 15;
    if (values.salinity > 4) healthScore -= 25;
    if (values.salinity > 8) healthScore -= 15;
    if (values.nitrogen < 50) healthScore -= 15;
    if (values.organicMatter > 30) healthScore -= 10;
    healthScore = Math.max(20, healthScore);
    
    // Select crops based on actual conditions
    const suitableCrops = this.selectSuitableCrops(values, classification);
    
    return {
      soilType: `${omLevel} organic matter soil with ${pHCategory.toLowerCase()} reaction`,
      pH: `${pHCategory} (${values.ph}) - ${this.getpHAdvice(values.ph)}`,
      healthScore,
      nutrients: {
        nitrogen: `${nLevel} (${values.nitrogen} ppm)`,
        phosphorus: `${pLevel} (${values.phosphorus} ppm)`,
        potassium: `${kLevel} (${values.potassium} ppm)`
      },
      organicMatter: `${omLevel} (${values.organicMatter}%)`,
      salinity: `${salinityLevel} (${values.salinity} dS/m)`,
      improvements: problems.map(p => p.solution),
      fertilizers: treatments.treatments,
      suitableCrops,
      managementPlan: {
        immediate: problems.filter(p => p.severity === 'High').map(p => p.solution),
        shortTerm: ['Monitor treatment effectiveness', 'Plant suitable crops', 'Adjust irrigation'],
        longTerm: ['Maintain optimal conditions', 'Regular soil testing', 'Sustainable practices']
      },
      monitoring: {
        soilTesting: values.salinity > 4 ? 'Monthly for salinity' : 'Every 6 months',
        organicMatter: 'Annual assessment',
        compaction: 'Seasonal check',
        salinity: values.salinity > 4 ? 'Weekly until <4 dS/m' : 'As needed'
      },
      riskFactors: problems.map(p => p.impact),
      successIndicators: this.getSuccessIndicators(values, problems),
      treatmentCost: treatments.totalCost
    };
  }
  
  static selectSuitableCrops(values, classification) {
    // Priority: Salinity > pH > Nutrients
    if (values.salinity > 4) {
      return [
        {name: 'Barley', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Rabi', duration: '4-5 months', investment: '₹15-20k/acre', roi: '120-150%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Low', soilMatch: `Salt-tolerant (EC ${values.salinity} dS/m)`},
        {name: 'Sugar Beet', suitabilityScore: 80, profitLevel: 'High Profit', season: 'Rabi', duration: '5-6 months', investment: '₹25-35k/acre', roi: '150-200%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'Medium', soilMatch: 'Excellent salinity tolerance'},
        {name: 'Quinoa', suitabilityScore: 90, profitLevel: 'High Profit', season: 'Rabi', duration: '3-4 months', investment: '₹20-30k/acre', roi: '180-250%', marketDemand: 'Very High', riskLevel: 'Medium', waterRequirement: 'Low', soilMatch: 'Superior salt tolerance + premium market'},
        {name: 'Date Palm', suitabilityScore: 88, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹80-120k/acre', roi: '200-300%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Highly salt-tolerant tree crop'},
        {name: 'Spinach', suitabilityScore: 75, profitLevel: 'Medium Profit', season: 'Rabi', duration: '2-3 months', investment: '₹10-15k/acre', roi: '130-160%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Moderate salt tolerance'}
      ];
    }
    
    if (values.ph < 6.0) {
      return [
        {name: 'Potatoes', suitabilityScore: 90, profitLevel: 'Good Profit', season: 'Rabi', duration: '3-4 months', investment: '₹25-35k/acre', roi: '150-200%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: `Perfect for pH ${values.ph} acidic soil`},
        {name: 'Blueberries', suitabilityScore: 95, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹80-120k/acre', roi: '250-400%', marketDemand: 'Very High', riskLevel: 'Medium', waterRequirement: 'Medium', soilMatch: 'Requires acidic soil pH 4.5-5.5'},
        {name: 'Tea', suitabilityScore: 92, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹40-60k/acre', roi: '200-300%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'High', soilMatch: 'Thrives in acidic conditions'},
        {name: 'Sweet Potatoes', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Kharif', duration: '4-5 months', investment: '₹20-30k/acre', roi: '140-180%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Low', soilMatch: 'Tolerates acidic soil well'},
        {name: 'Radish', suitabilityScore: 80, profitLevel: 'Medium Profit', season: 'Rabi', duration: '2-3 months', investment: '₹8-12k/acre', roi: '120-150%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Adapts to acidic conditions'}
      ];
    }
    
    return [
      {name: 'Wheat', suitabilityScore: 88, profitLevel: 'High Profit', season: 'Rabi', duration: '4-5 months', investment: '₹20-25k/acre', roi: '150-180%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Good for neutral pH soil'},
      {name: 'Rice', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Kharif', duration: '3-4 months', investment: '₹18-22k/acre', roi: '120-150%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'High', soilMatch: 'Versatile crop'},
      {name: 'Maize', suitabilityScore: 87, profitLevel: 'Stable Profit', season: 'Kharif', duration: '3-4 months', investment: '₹15-20k/acre', roi: '110-140%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Adapts to various conditions'}
    ];
  }
  
  static getpHAdvice(ph) {
    if (ph < 5.5) return 'Apply lime 300-500 kg/acre immediately';
    if (ph < 6.0) return 'Apply lime 200-300 kg/acre';
    if (ph > 8.5) return 'Apply sulfur 100-200 kg/acre';
    if (ph > 8.0) return 'Monitor for alkalinity issues';
    return 'pH is in acceptable range';
  }
  
  static getSuccessIndicators(values, problems) {
    const indicators = ['Improved crop germination and growth', 'Better nutrient uptake efficiency'];
    
    if (values.ph < 6.0) indicators.push('pH rises to 6.0-6.5 range');
    if (values.salinity > 4) indicators.push('Salinity reduces below 4 dS/m');
    if (values.nitrogen < 50) indicators.push('Healthier green foliage');
    
    indicators.push('Increased crop yields and quality');
    return indicators;
  }

  static async optimizeIrrigation(farmData) {
    // Sanitize input data to prevent XSS
    const sanitizedData = this.sanitizeInputData(farmData);
    
    const systemPrompt = `You are an expert precision agriculture specialist with IoT and sensor technology expertise.

SENSOR ANALYSIS RULES:
- Soil Moisture: <30%=Low, 30-60%=Optimal, >60%=High
- Air Temperature: <15°C=Low, 15-30°C=Optimal, >30°C=High
- Humidity: <40%=Low, 40-70%=Optimal, >70%=High
- Light Intensity: <20000 lux=Low, 20000-50000=Good, >50000=High

IRRIGATION SCHEDULING:
- Morning irrigation (6-8 AM) most efficient
- Avoid midday watering (water loss)
- Evening watering can cause fungal issues

Return ONLY valid JSON:
{
  "overallStatus": "Optimal|Good|Warning|Critical",
  "alerts": [
    {
      "type": "alert type",
      "severity": "Low|Medium|High|Critical",
      "message": "detailed alert message",
      "action": "recommended immediate action"
    }
  ],
  "sensorAnalysis": {
    "soilMoisture": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "temperature": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "humidity": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "lightIntensity": {"status": "Optimal|Low|High", "recommendation": "action needed"}
  },
  "recommendations": {
    "irrigation": "detailed irrigation schedule",
    "climate": "climate control suggestions",
    "timing": "optimal timing for farm activities",
    "fertilization": "nutrient application timing"
  },
  "predictions": {
    "nextIrrigation": "when to irrigate next with timing",
    "weatherImpact": "weather impact on crops",
    "growthStage": "current crop growth analysis",
    "yieldImpact": "expected yield impact"
  },
  "optimization": {
    "waterUsage": "water optimization strategies",
    "energyEfficiency": "energy saving methods",
    "costReduction": "cost reduction opportunities",
    "automationTips": ["IoT automation suggestions"]
  },
  "trends": {
    "soilMoisture": "moisture trend analysis",
    "temperature": "temperature pattern analysis",
    "growth": "crop growth trend prediction",
    "efficiency": "current vs optimal efficiency"
  },
  "actionPlan": {
    "immediate": ["urgent actions needed now"],
    "today": ["actions needed today"],
    "thisWeek": ["weekly monitoring tasks"]
  }
}`;

    const response = await this.callAPI(`IOT SENSOR MONITORING:
Soil Moisture: ${sanitizedData.soilMoisture}%
Air Temperature: ${sanitizedData.airTemperature}°C
Humidity: ${sanitizedData.humidity}%
Light Intensity: ${sanitizedData.lightIntensity} lux
Recent Rainfall: ${sanitizedData.rainfall}mm

Analyze sensor data scientifically and provide precise irrigation scheduling, climate optimization, and actionable farming recommendations based on current conditions.`, systemPrompt);
    return this.parseJSON(response) || this.getDefaultIrrigation();
  }

  static async analyzeMarketConditions(location, season, soilType) {
    const systemPrompt = `You are a market analyst. Return ONLY valid JSON:
{
  "shortages": ["crop1", "crop2"],
  "corporateDemand": [{"company": "name", "crops": ["crop1"], "increase": "25%"}],
  "priceRising": ["crop1", "crop2"],
  "nutritionNeeds": ["protein", "iron"]
}`;

    const response = await this.callAPI(`Analyze current market conditions for ${location}, ${season} season, ${soilType} soil. Focus on supply shortages, corporate procurement increases, rising prices, and nutrition gaps.`, systemPrompt);
    return this.parseJSON(response) || {shortages: ['Turmeric', 'Coriander'], priceRising: ['Chili', 'Millets'], nutritionNeeds: ['protein', 'iron']};
  }

  static async suggestCropsBasedOnMarket(marketConditions, location, soilType, budget, season, farmSize, waterAvailability) {
    const systemPrompt = `You are an agricultural expert specializing in soil-crop compatibility and market analysis. Return ONLY valid JSON:
[{
  "name": "crop name",
  "profit": "high|medium|low",
  "reason": "why profitable based on market",
  "marketAlignment": "how it aligns with market needs",
  "soilSuitability": "why this crop is suitable for the specified soil type"
}]`;

    const marketInfo = `Market shortages: ${marketConditions.shortages?.join(',')}, Corporate demand: ${JSON.stringify(marketConditions.corporateDemand)}, Rising prices: ${marketConditions.priceRising?.join(',')}, Nutrition needs: ${marketConditions.nutritionNeeds?.join(',')}`;
    const response = await this.callAPI(`${marketInfo}. Location: ${location}, Season: ${season}, Soil: ${soilType}, Farm Size: ${farmSize} acres, Budget: ${budget}, Water: ${waterAvailability}. Suggest exactly 5 most profitable crops that are suitable for ${soilType} soil in ${season} season with ${waterAvailability} water availability, within ${budget} budget for ${farmSize} acres in ${location}. Consider: 1) Soil-crop compatibility 2) Season suitability 3) Water requirements 4) Budget constraints 5) Regional climate 6) Market profitability.`, systemPrompt);
    
    const parsed = this.parseJSON(response);
    return parsed || [
      {name: 'Groundnut', profit: 'high', reason: 'High market demand', soilSuitability: 'Well-suited for red soil with good drainage'}, 
      {name: 'Cotton', profit: 'high', reason: 'Export potential', soilSuitability: 'Thrives in red soil with moderate fertility'}, 
      {name: 'Sorghum', profit: 'medium', reason: 'Drought tolerance', soilSuitability: 'Excellent for red soil, drought-resistant'},
      {name: 'Sunflower', profit: 'high', reason: 'Oil industry demand', soilSuitability: 'Adapts well to red soil conditions'},
      {name: 'Millets', profit: 'medium', reason: 'Health food trend', soilSuitability: 'Perfect for red soil, low water requirement'}
    ];
  }

  static async analyzeCorporateProcurement(crops, location) {
    const systemPrompt = `You are a corporate procurement analyst. Return ONLY valid JSON:
[{
  "company": "company name",
  "crops": ["crop1", "crop2"],
  "increasePercentage": "X%",
  "reason": "why increasing procurement",
  "contractOpportunity": "direct contract potential"
}]`;

    const response = await this.callAPI(`Analyze which companies are increasing procurement for ${crops.join(', ')} in ${location}. Focus on food processing companies, FMCG brands, and export companies. Provide at least 5-7 companies with their procurement increases.`, systemPrompt);
    return this.parseJSON(response) || [
      {company: 'Food Corp Ltd', crops: crops.slice(0,2), increasePercentage: '30%', reason: 'Export demand'},
      {company: 'ITC Limited', crops: [crops[0]], increasePercentage: '25%', reason: 'Processing expansion'},
      {company: 'Adani Wilmar', crops: crops.slice(1,3), increasePercentage: '20%', reason: 'Supply chain growth'},
      {company: 'Britannia Industries', crops: [crops[0], crops[2]], increasePercentage: '35%', reason: 'Product diversification'},
      {company: 'Nestle India', crops: crops.slice(0,2), increasePercentage: '15%', reason: 'Raw material sourcing'}
    ];
  }

  static async analyzeRegionalGaps(crops, location) {
    const systemPrompt = `You are a regional supply gap analyst. Return ONLY valid JSON:
[{
  "region": "region name",
  "shortage": "crop with shortage",
  "opportunity": "market opportunity",
  "demandLevel": "High|Medium|Low",
  "transportCost": "logistics consideration"
}]`;

    const response = await this.callAPI(`Identify regional supply gaps for ${crops.join(', ')} around ${location}. Which regions have shortages and high demand for these crops?`, systemPrompt);
    return this.parseJSON(response) || [{region: 'North India', shortage: crops[0], opportunity: 'Supply gap', demandLevel: 'High'}];
  }

  static async getFutureValueProjections(crops, timelineData, location) {
    const systemPrompt = `You are a market value projection analyst. Return ONLY valid JSON:
[{
  "crop": "crop name",
  "currentPrice": "₹X per quintal",
  "futureValueIncrease": "+X-Y%",
  "demandGrowth": "X% growth",
  "reason": "why value will increase",
  "marketDrivers": ["demand factors"]
}]`;

    const timelineInfo = Array.isArray(timelineData) ? timelineData.map(t => `${t.crop}: ${t.growthPeriod}`).join(', ') : 'Standard timeline';
    const response = await this.callAPI(`Based on growth timeline (${timelineInfo}) for crops ${crops.join(', ')} in ${location}, project future value increases considering market trends, demand growth, and supply constraints.`, systemPrompt);
    return this.parseJSON(response) || crops.map(crop => ({crop, futureValueIncrease: '+25%', reason: 'Market growth'}));
  }

  static async analyzeGrowthTimeline(crops, season) {
    const systemPrompt = `You are a crop timeline specialist. Return ONLY valid JSON:
[{
  "crop": "crop name",
  "growthPeriod": "X-Y days",
  "season": "best season",
  "stages": ["germination", "vegetative", "flowering", "harvest"],
  "criticalPeriods": ["water-sensitive periods"]
}]`;

    const response = await this.callAPI(`Analyze growth timeline for ${crops.join(', ')} in ${season} season. Provide detailed growth periods and critical stages.`, systemPrompt);
    return this.parseJSON(response) || crops.map(crop => ({crop, growthPeriod: '90-120 days', season: 'Kharif'}));
  }

  static getDefaultCropAnalysis() {
    return {
      cropHealth: 'Good',
      healthScore: 78,
      primaryIssue: 'General Health Check',
      confidence: 75,
      diseases: [],
      treatmentPlan: {
        chemical: 'Preventive spray as needed',
        organic: 'Neem oil application',
        frequency: 'Monthly monitoring'
      },
      recommendations: {
        immediate: ['Monitor plant health', 'Check irrigation system'],
        weekly: ['Regular field inspection', 'Weather monitoring'],
        prevention: ['Maintain field hygiene', 'Use quality seeds']
      },
      expectedOutcome: {
        recoveryTime: '1-2 weeks',
        successRate: '90-95%',
        yieldRecovery: 'Full recovery'
      }
    };
  }

  static getDefaultSoilAnalysis() {
    return {
      soilType: 'Standard soil requiring assessment',
      pH: 'Neutral (7.0) - Good for most crops',
      healthScore: 75,
      nutrients: {nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'Medium'},
      organicMatter: 'Medium (3%)',
      improvements: ['Regular soil testing', 'Balanced fertilization', 'Organic matter maintenance'],
      fertilizers: ['Balanced NPK as needed', 'Organic compost 2-5 tons/acre', 'Micronutrients if deficient'],
      suitableCrops: [
        {name: 'Wheat', suitabilityScore: 85, profitLevel: 'High Profit', season: 'Rabi', duration: '4-5 months', investment: '₹20-25k/acre', roi: '150-180%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Suitable for neutral soil'},
        {name: 'Rice', suitabilityScore: 80, profitLevel: 'Medium Profit', season: 'Kharif', duration: '3-4 months', investment: '₹18-22k/acre', roi: '120-150%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'High', soilMatch: 'Adapts to various soil types'},
        {name: 'Maize', suitabilityScore: 82, profitLevel: 'Stable Profit', season: 'Kharif', duration: '3-4 months', investment: '₹15-20k/acre', roi: '110-140%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Versatile crop for most soils'}
      ],
      managementPlan: {
        immediate: ['Soil testing for accurate assessment'],
        shortTerm: ['Balanced fertilization', 'Crop selection'],
        longTerm: ['Soil health monitoring', 'Sustainable practices']
      },
      monitoring: {
        soilTesting: 'Every 6 months',
        organicMatter: 'Annual assessment',
        compaction: 'Seasonal check',
        salinity: 'Monitor if needed'
      },
      riskFactors: ['Weather-related stress', 'Nutrient imbalances'],
      successIndicators: ['Healthy crop growth', 'Good yields', 'Soil health maintenance']
    };
  }

  static getDefaultIrrigation() {
    return {
      overallStatus: 'Good',
      alerts: [
        {type: 'Soil Moisture', severity: 'Medium', message: 'Soil moisture slightly below optimal', action: 'Schedule irrigation within 6 hours'}
      ],
      sensorAnalysis: {
        soilMoisture: {status: 'Low', recommendation: 'Increase irrigation frequency'},
        temperature: {status: 'Optimal', recommendation: 'Continue current monitoring'},
        humidity: {status: 'Good', recommendation: 'Maintain current levels'},
        lightIntensity: {status: 'Optimal', recommendation: 'Good sunlight exposure'}
      },
      recommendations: {
        irrigation: 'Water every 2 days in early morning (6-8 AM)',
        climate: 'Provide shade during peak afternoon hours',
        timing: 'Best time for fertilization: early morning',
        fertilization: 'Apply liquid fertilizer after next irrigation'
      },
      predictions: {
        nextIrrigation: 'Tomorrow morning at 6 AM',
        weatherImpact: 'Clear weather expected, normal irrigation needed',
        growthStage: 'Vegetative stage progressing well',
        yieldImpact: 'Current conditions support 85% of optimal yield'
      },
      optimization: {
        waterUsage: 'Switch to drip irrigation for 30% water savings',
        energyEfficiency: 'Use solar-powered pumps during day hours',
        costReduction: 'Automated scheduling can save ₹3000/month',
        automationTips: ['Install soil moisture sensors', 'Use timer-based irrigation']
      },
      trends: {
        soilMoisture: 'Declining trend, needs attention',
        temperature: 'Stable within optimal range',
        growth: 'Steady growth rate observed',
        efficiency: '70% current vs 90% optimal efficiency'
      },
      actionPlan: {
        immediate: ['Check irrigation system', 'Monitor soil moisture'],
        today: ['Schedule irrigation', 'Check weather forecast'],
        thisWeek: ['Install moisture sensors', 'Optimize irrigation timing']
      }
    };
  }
}