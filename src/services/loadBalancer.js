// Minimal Load Balancer with Failover
class LoadBalancer {
  constructor() {
    this.endpoints = [
      { url: 'https://openrouter.ai/api/v1/chat/completions', weight: 1, healthy: true },
      { url: 'https://api.openai.com/v1/chat/completions', weight: 1, healthy: true },
      { url: 'https://api.anthropic.com/v1/messages', weight: 1, healthy: true }
    ];
    this.currentIndex = 0;
    this.requestQueue = [];
    this.processing = false;
    this.maxConcurrent = 3;
    this.activeRequests = 0;
  }

  // Round-robin with health check
  getNextEndpoint() {
    const healthyEndpoints = this.endpoints.filter(ep => ep.healthy);
    if (healthyEndpoints.length === 0) {
      throw new Error('No healthy endpoints available');
    }
    
    const endpoint = healthyEndpoints[this.currentIndex % healthyEndpoints.length];
    this.currentIndex++;
    return endpoint;
  }

  // Mark endpoint as unhealthy and retry
  markUnhealthy(url) {
    const endpoint = this.endpoints.find(ep => ep.url === url);
    if (endpoint) {
      endpoint.healthy = false;
      setTimeout(() => { endpoint.healthy = true; }, 30000); // Retry after 30s
    }
  }

  // Queue requests to prevent API overload
  async queueRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.activeRequests >= this.maxConcurrent) return;
    
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
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  // Execute with automatic failover
  async executeWithFailover(requestFn, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const endpoint = this.getNextEndpoint();
        return await requestFn(endpoint.url);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          this.markUnhealthy(this.endpoints[this.currentIndex - 1]?.url);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
  }
}

export const apiLoadBalancer = new LoadBalancer();