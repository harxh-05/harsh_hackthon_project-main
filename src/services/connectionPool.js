// Connection Pool with Circuit Breaker
class ConnectionPool {
  constructor(maxConnections = 5) {
    this.maxConnections = maxConnections;
    this.activeConnections = 0;
    this.waitingQueue = [];
    this.circuitBreaker = {
      failures: 0,
      threshold: 3,
      timeout: 30000,
      state: 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    };
  }

  async acquire() {
    if (this.circuitBreaker.state === 'OPEN') {
      if (Date.now() - this.circuitBreaker.lastFailure > this.circuitBreaker.timeout) {
        this.circuitBreaker.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }

  release() {
    this.activeConnections--;
    if (this.waitingQueue.length > 0) {
      const next = this.waitingQueue.shift();
      this.activeConnections++;
      next();
    }
  }

  recordSuccess() {
    this.circuitBreaker.failures = 0;
    if (this.circuitBreaker.state === 'HALF_OPEN') {
      this.circuitBreaker.state = 'CLOSED';
    }
  }

  recordFailure() {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailure = Date.now();
    
    if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
      this.circuitBreaker.state = 'OPEN';
    }
  }
}

export const connectionPool = new ConnectionPool();