// Enhanced Load Balancer with Advanced Features
class LoadBalancer {
  constructor() {
    this.endpoints = [
      { url: 'https://openrouter.ai/api/v1/chat/completions', weight: 3, healthy: true, responseTime: 0, failures: 0 },
      { url: 'https://api.openai.com/v1/chat/completions', weight: 2, healthy: true, responseTime: 0, failures: 0 },
      { url: 'https://api.anthropic.com/v1/messages', weight: 1, healthy: true, responseTime: 0, failures: 0 }
    ];
    this.currentIndex = 0;
    this.requestQueue = [];
    this.processing = false;
    this.maxConcurrent = 5;
    this.activeRequests = 0;
    this.healthCheckInterval = 30000;
    this.startHealthChecks();
  }

  // Weighted round-robin with performance-based selection
  getNextEndpoint() {
    const healthyEndpoints = this.endpoints.filter(ep => ep.healthy);
    if (healthyEndpoints.length === 0) {
      throw new Error('No healthy endpoints available');
    }
    
    // Sort by response time and weight
    healthyEndpoints.sort((a, b) => {
      const scoreA = a.weight / (a.responseTime || 1);
      const scoreB = b.weight / (b.responseTime || 1);
      return scoreB - scoreA;
    });
    
    const endpoint = healthyEndpoints[this.currentIndex % healthyEndpoints.length];
    this.currentIndex++;
    return endpoint;
  }

  // Enhanced health checking with response time tracking
  async checkEndpointHealth(endpoint) {
    const start = Date.now();
    try {
      const response = await fetch(endpoint.url, {
        method: 'HEAD',
        timeout: 5000
      });
      
      endpoint.responseTime = Date.now() - start;
      endpoint.healthy = response.ok;
      endpoint.failures = response.ok ? 0 : endpoint.failures + 1;
      
      // Mark unhealthy after 3 consecutive failures
      if (endpoint.failures >= 3) {
        endpoint.healthy = false;
      }
    } catch (error) {
      endpoint.healthy = false;
      endpoint.failures++;
      endpoint.responseTime = 9999;
    }
  }

  // Automatic health monitoring
  startHealthChecks() {
    setInterval(() => {
      this.endpoints.forEach(endpoint => {
        this.checkEndpointHealth(endpoint);
      });
    }, this.healthCheckInterval);
  }

  // Priority queue with request classification
  async queueRequest(requestFn, priority = 'normal') {
    return new Promise((resolve, reject) => {
      const request = { requestFn, resolve, reject, priority, timestamp: Date.now() };
      
      if (priority === 'high') {
        this.requestQueue.unshift(request);
      } else {
        this.requestQueue.push(request);
      }
      
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.activeRequests >= this.maxConcurrent) return;
    
    // Sort queue by priority and age
    this.requestQueue.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return a.timestamp - b.timestamp;
    });
    
    const request = this.requestQueue.shift();
    if (!request) return;

    this.processing = true;
    this.activeRequests++;

    try {
      const result = await this.executeWithFailover(request.requestFn);
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests--;
      this.processing = false;
      if (this.requestQueue.length > 0) {
        setTimeout(() => this.processQueue(), 50);
      }
    }
  }

  // Enhanced failover with exponential backoff
  async executeWithFailover(requestFn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const endpoint = this.getNextEndpoint();
        const start = Date.now();
        
        const result = await requestFn(endpoint.url);
        
        // Update performance metrics
        endpoint.responseTime = Date.now() - start;
        endpoint.failures = 0;
        
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const endpoint = this.endpoints.find(ep => ep.url === this.endpoints[this.currentIndex - 1]?.url);
          if (endpoint) {
            endpoint.failures++;
            if (endpoint.failures >= 2) {
              endpoint.healthy = false;
            }
          }
          
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // Get load balancer statistics
  getStats() {
    return {
      totalEndpoints: this.endpoints.length,
      healthyEndpoints: this.endpoints.filter(ep => ep.healthy).length,
      queueSize: this.requestQueue.length,
      activeRequests: this.activeRequests,
      averageResponseTime: this.endpoints.reduce((sum, ep) => sum + ep.responseTime, 0) / this.endpoints.length
    };
  }
}

export const apiLoadBalancer = new LoadBalancer();