// Validation limits for agricultural input fields
export const VALIDATION_LIMITS = {
  // Soil Analysis limits
  soil: {
    ph: { min: 0, max: 14, type: 'number', unit: 'pH' },
    moisture: { min: 0, max: 100, type: 'number', unit: '%' },
    organicMatter: { min: 0, max: 100, type: 'number', unit: '%' },
    nitrogen: { min: 0, max: 1000, type: 'number', unit: 'ppm' },
    phosphorus: { min: 0, max: 1000, type: 'number', unit: 'ppm' },
    potassium: { min: 0, max: 1000, type: 'number', unit: 'ppm' },
    salinity: { min: 0, max: 20, type: 'number', unit: 'dS/m' },
    temperature: { min: -10, max: 60, type: 'number', unit: '°C' }
  },
  
  // Crop Health limits
  crop: {
    fieldSize: { min: 0.1, max: 10000, type: 'number', unit: 'acres' },
    cropType: { type: 'text', maxLength: 50 },
    variety: { type: 'text', maxLength: 50 },
    symptoms: { type: 'text', maxLength: 500 },
    location: { type: 'text', maxLength: 100 },
    weatherConditions: { type: 'text', maxLength: 200 },
    fertilizer: { type: 'text', maxLength: 100 },
    pesticide: { type: 'text', maxLength: 100 }
  },
  
  // IoT Monitoring limits
  monitoring: {
    soilMoisture: { min: 0, max: 100, type: 'number', unit: '%' },
    airTemperature: { min: -50, max: 70, type: 'number', unit: '°C' },
    humidity: { min: 0, max: 100, type: 'number', unit: '%' },
    lightIntensity: { min: 0, max: 200000, type: 'number', unit: 'lux' },
    rainfall: { min: 0, max: 1000, type: 'number', unit: 'mm' }
  }
};

// Validation function
export const validateInput = (value, fieldName, category) => {
  const limits = VALIDATION_LIMITS[category]?.[fieldName];
  if (!limits) return { isValid: true, message: '' };
  
  // Empty value is allowed
  if (!value || value === '') return { isValid: true, message: '' };
  
  if (limits.type === 'number') {
    const numValue = parseFloat(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return { 
        isValid: false, 
        message: `Please enter a valid number for ${fieldName}` 
      };
    }
    
    // Check min/max limits
    if (numValue < limits.min || numValue > limits.max) {
      return { 
        isValid: false, 
        message: `${fieldName} must be between ${limits.min} and ${limits.max} ${limits.unit}` 
      };
    }
  } else if (limits.type === 'text') {
    if (limits.maxLength && value.length > limits.maxLength) {
      return { 
        isValid: false, 
        message: `${fieldName} must be less than ${limits.maxLength} characters` 
      };
    }
  }
  
  return { isValid: true, message: '' };
};

// Get field limits for display
export const getFieldLimits = (fieldName, category) => {
  const limits = VALIDATION_LIMITS[category]?.[fieldName];
  if (!limits) return null;
  
  if (limits.type === 'number') {
    return `${limits.min}-${limits.max} ${limits.unit}`;
  } else if (limits.type === 'text' && limits.maxLength) {
    return `Max ${limits.maxLength} characters`;
  }
  
  return null;
};