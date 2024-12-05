import { ERROR_MESSAGES, ERROR_TYPES, RETRY_CODES } from '@/lib/constants/errors';

export class MetadataError extends Error {
  constructor(
    message: string,
    public type: keyof typeof ERROR_TYPES,
    public provider?: string,
    public retryable: boolean = false,
    public originalError?: any
  ) {
    super(message);
    this.name = 'MetadataError';
  }
}

export function handleProviderError(error: any, provider: string): MetadataError {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new MetadataError(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_TYPES.NETWORK,
      provider,
      true
    );
  }

  // API-specific errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;

    if (status === 401 || status === 403) {
      return new MetadataError(
        ERROR_MESSAGES.PROVIDER_AUTH_FAILED,
        ERROR_TYPES.AUTH,
        provider,
        false
      );
    }

    if (status === 429) {
      return new MetadataError(
        ERROR_MESSAGES.PROVIDER_RATE_LIMIT,
        ERROR_TYPES.RATE_LIMIT,
        provider,
        true
      );
    }

    if (status === 404) {
      return new MetadataError(
        ERROR_MESSAGES.PROVIDER_NOT_FOUND,
        ERROR_TYPES.NOT_FOUND,
        provider,
        false
      );
    }

    if (RETRY_CODES.has(status)) {
      return new MetadataError(
        ERROR_MESSAGES.PROVIDER_NOT_AVAILABLE,
        ERROR_TYPES.NETWORK,
        provider,
        true
      );
    }
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return new MetadataError(
      ERROR_MESSAGES.TIMEOUT_ERROR,
      ERROR_TYPES.TIMEOUT,
      provider,
      true
    );
  }

  // Default unknown error
  return new MetadataError(
    ERROR_MESSAGES.UNKNOWN_ERROR,
    ERROR_TYPES.UNKNOWN,
    provider,
    false,
    error
  );
}

export function isRetryableError(error: any): boolean {
  if (error instanceof MetadataError) {
    return error.retryable;
  }
  
  if (error.status || error.statusCode) {
    return RETRY_CODES.has(error.status || error.statusCode);
  }
  
  return error instanceof TypeError && error.message.includes('fetch');
}