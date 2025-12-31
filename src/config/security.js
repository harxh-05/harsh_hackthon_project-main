// Security configuration and constants

export const SECURITY_CONFIG = {
  // Input validation limits
  MAX_INPUT_LENGTH: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Allowed file types
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  // Rate limiting
  API_RATE_LIMIT: 10, // requests per minute
  
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:"],
    'connect-src': ["'self'", "https://openrouter.ai", "https://www.alphavantage.co"],
    'media-src': ["'self'", "blob:"]
  }
};

export const validateFileType = (file) => {
  return SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type);
};

export const validateFileSize = (file) => {
  return file.size <= SECURITY_CONFIG.MAX_FILE_SIZE;
};

export const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  return input.length <= SECURITY_CONFIG.MAX_INPUT_LENGTH;
};