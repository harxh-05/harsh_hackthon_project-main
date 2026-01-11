// Advanced Request Throttler with Rate Limiting
class RequestThrottler {
  constructor() {
    this.rateLimits = new Map();
    this.requestCounts = new Map();
    this.adaptiveThrottling = true;
    this.baseDelay = 100;
    this.maxDelay = 5000;
    this.windowSize = 60000; // 1 minute
  }  // Set rate limit for specific endpoint
  setRateLimit(endpoint, requestsPerMinute) {
    this.rateLimits.set(endpoint, {
      limit: requestsPerMinute,
      window: this.windowSize,
      requests: []
    });
  }  // Check if request is allowed
  isRequestAllowed(endpoint) {
    const rateLimit = this.rateLimits.get(endpoint);
    if (!rateLimit) return true;

    const now = Date.now();
    const windowStart = now - rateLimit.window;
    
    // Clean old requests
    rateLimit.requests = rateLimit.requests.filter(time => time > windowStart);
    
    return rateLimit.requests.length < rateLimit.limit;
  }  // Record request
  recordRequest(endpoint) {
    const rateLimit = this.rateLimits.get(endpoint);
    if (rateLimit) {
      rateLimit.requests.push(Date.now());
    }
  }  // Calculate adaptive delay based on response times
  calculateDelay(endpoint, responseTime) {
    if (!this.adaptiveThrottling) return this.baseDelay;
    
    // Increase delay if response time is high
    if (responseTime > 5000) return this.maxDelay;
    if (responseTime > 2000) return this.baseDelay * 3;
    if (responseTime > 1000) return this.baseDelay * 2;
    
    return this.baseDelay;
  }  // Throttle request with adaptive delay
  async throttleRequest(endpoint, requestFn) {
    if (!this.isRequestAllowed(endpoint)) {
      throw new Error(`Rate limit exceeded for ${endpoint}`);
    }

    this.recordRequest(endpoint);
    
    const start = Date.now();
    const result = await requestFn();
    const responseTime = Date.now() - start;
    
    const delay = this.calculateDelay(endpoint, responseTime);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    return result;
  }  // Get throttling statistics
  getStats() {
    const stats = {};
    for (const [endpoint, rateLimit] of this.rateLimits) {
      stats[endpoint] = {
        requestsInWindow: rateLimit.requests.length,
        limit: rateLimit.limit,
        utilizationPercent: (rateLimit.requests.length / rateLimit.limit) * 100
      };
    }
    return stats;
  }
}

// Initialize with common API rate limits
const requestThrottler = new RequestThrottler();
requestThrottler.setRateLimit('https://openrouter.ai/api/v1/chat/completions', 100);
requestThrottler.setRateLimit('https://api.openai.com/v1/chat/completions', 60);
requestThrottler.setRateLimit('https://api.anthropic.com/v1/messages', 50);

export { requestThrottler };