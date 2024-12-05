import pLimit from 'p-limit';

interface RateLimitConfig {
  maxRequests: number;
  interval: number;
}

export class RateLimiter {
  private limiters = new Map<string, ReturnType<typeof pLimit>>();
  private configs = new Map<string, RateLimitConfig>();

  constructor(defaultConfig: RateLimitConfig = { maxRequests: 10, interval: 1000 }) {
    this.setConfig('default', defaultConfig);
  }

  setConfig(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config);
    this.limiters.set(key, pLimit(config.maxRequests));

    // Reset limiter periodically
    setInterval(() => {
      this.limiters.set(key, pLimit(config.maxRequests));
    }, config.interval);
  }

  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const limiter = this.limiters.get(key) || this.limiters.get('default');
    
    if (!limiter) {
      throw new Error(`No rate limiter found for key: ${key}`);
    }

    try {
      return await limiter(fn);
    } catch (error) {
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();

// Configure rate limits for different providers
rateLimiter.setConfig('spotify', { maxRequests: 30, interval: 30000 }); // 30 requests per 30 seconds
rateLimiter.setConfig('listenNotes', { maxRequests: 5, interval: 1000 }); // 5 requests per second
rateLimiter.setConfig('googleBooks', { maxRequests: 100, interval: 60000 }); // 100 requests per minute