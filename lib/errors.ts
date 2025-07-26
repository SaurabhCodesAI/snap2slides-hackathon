// Error handling utilities for better error management
// This provides a consistent way to handle errors across the application

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API-specific errors
 */
export class APIError extends AppError {
  constructor(
    message: string,
    code: string = 'API_ERROR',
    statusCode: number = 500
  ) {
    super(message, code, statusCode);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  public readonly field: string | undefined;

  constructor(
    message: string,
    field?: string,
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, code, 400);
    this.field = field;
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required',
    code: string = 'AUTHENTICATION_ERROR'
  ) {
    super(message, code, 401);
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Insufficient permissions',
    code: string = 'AUTHORIZATION_ERROR'
  ) {
    super(message, code, 403);
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number | undefined;

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    code: string = 'RATE_LIMIT_ERROR'
  ) {
    super(message, code, 429);
    this.retryAfter = retryAfter;
  }
}

/**
 * External service errors (Gemini API, etc.)
 */
export class ExternalServiceError extends AppError {
  public readonly service: string;
  public readonly originalError: Error | undefined;

  constructor(
    message: string,
    service: string,
    originalError?: Error,
    code: string = 'EXTERNAL_SERVICE_ERROR'
  ) {
    super(message, code, 502);
    this.service = service;
    this.originalError = originalError;
  }
}

/**
 * Result type for safe error handling
 */
export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Creates a success result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Creates an error result
 */
export function failure<E extends AppError>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Wraps a function to return a Result type
 */
export function safeAsync<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<Result<T, AppError>> {
  return async (...args: Args) => {
    try {
      const data = await fn(...args);
      return success(data);
    } catch (error) {
      if (error instanceof AppError) {
        return failure(error);
      }
      
      const appError = new AppError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'UNEXPECTED_ERROR',
        500,
        false
      );
      
      return failure(appError);
    }
  };
}

/**
 * Wraps a synchronous function to return a Result type
 */
export function safe<T, Args extends unknown[]>(
  fn: (...args: Args) => T
): (...args: Args) => Result<T, AppError> {
  return (...args: Args) => {
    try {
      const data = fn(...args);
      return success(data);
    } catch (error) {
      if (error instanceof AppError) {
        return failure(error);
      }
      
      const appError = new AppError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'UNEXPECTED_ERROR',
        500,
        false
      );
      
      return failure(appError);
    }
  };
}

/**
 * Error logging utility
 */
export function logError(error: Error | AppError, context?: Record<string, unknown>): void {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    ...(error instanceof AppError && {
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  } else {
    // In production, send to logging service
    console.error(JSON.stringify(errorInfo));
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryCondition = () => true,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries || !retryCondition(lastError)) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(delay, maxDelay)));
      delay *= backoffFactor;
    }
  }

  throw lastError!;
}

/**
 * Circuit breaker pattern for external services
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.lastFailureTime && 
          Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new ExternalServiceError(
          'Circuit breaker is OPEN - service unavailable',
          'circuit-breaker'
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}
