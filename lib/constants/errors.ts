export const ERROR_MESSAGES = {
  // Provider errors
  PROVIDER_NOT_AVAILABLE: 'Service temporarily unavailable',
  PROVIDER_RATE_LIMIT: 'Too many requests, please try again later',
  PROVIDER_AUTH_FAILED: 'Authentication failed',
  PROVIDER_NOT_FOUND: 'Content not found',
  
  // Network errors
  NETWORK_ERROR: 'Network connection error',
  TIMEOUT_ERROR: 'Request timed out',
  
  // Cache errors
  CACHE_ERROR: 'Storage error',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred',
  INVALID_INPUT: 'Invalid search parameters',
} as const;

export const PROVIDER_CONFIGS = {
  spotify: {
    maxRetries: 3,
    cacheDuration: 3600, // 1 hour
    rateLimit: {
      requests: 30,
      interval: 30000, // 30 seconds
    },
    timeout: 5000,
  },
  listenNotes: {
    maxRetries: 2,
    cacheDuration: 7200, // 2 hours
    rateLimit: {
      requests: 5,
      interval: 1000, // 1 second
    },
    timeout: 10000,
  },
  googleBooks: {
    maxRetries: 2,
    cacheDuration: 86400, // 24 hours
    rateLimit: {
      requests: 100,
      interval: 60000, // 1 minute
    },
    timeout: 8000,
  },
} as const;

export const RETRY_CODES = new Set([
  408, // Request Timeout
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  RATE_LIMIT: 'rateLimit',
  NOT_FOUND: 'notFound',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
} as const;