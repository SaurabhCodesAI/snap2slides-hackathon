// Health check API endpoint for monitoring application status
// This endpoint provides information about the application's health and dependencies

import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check response interface
 */
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database?: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    gemini?: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    memory?: {
      used: number;
      total: number;
      percentage: number;
    };
    disk?: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  environment: string;
}

/**
 * Check Gemini API health
 */
async function checkGeminiHealth(): Promise<{
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Simple check - just verify the API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        status: 'down',
        error: 'GEMINI_API_KEY not configured',
      };
    }

    // In a real implementation, you might make a simple API call
    // For now, just check configuration
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check database health (if applicable)
 */
async function checkDatabaseHealth(): Promise<{
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // If MongoDB is configured, check connection
    if (process.env.MONGODB_URI) {
      // In a real implementation, you'd ping the database
      // For now, just check configuration
      return {
        status: 'up',
        responseTime: Date.now() - startTime,
      };
    }
    
    // No database configured
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get memory usage information
 */
function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    const total = usage.heapTotal;
    const used = usage.heapUsed;
    
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100),
    };
  }
  
  return {
    used: 0,
    total: 0,
    percentage: 0,
  };
}

/**
 * Get application uptime in seconds
 */
function getUptime(): number {
  if (typeof process !== 'undefined' && process.uptime) {
    return Math.floor(process.uptime());
  }
  return 0;
}

/**
 * Main health check handler
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Perform all health checks in parallel
    const [geminiCheck, databaseCheck] = await Promise.all([
      checkGeminiHealth(),
      checkDatabaseHealth(),
    ]);

    const memoryUsage = getMemoryUsage();
    const uptime = getUptime();

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (geminiCheck.status === 'down') {
      overallStatus = 'unhealthy';
    } else if (databaseCheck.status === 'down') {
      overallStatus = 'degraded';
    }

    // Check memory usage
    if (memoryUsage.percentage > 90) {
      overallStatus = overallStatus === 'healthy' ? 'degraded' : 'unhealthy';
    }

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime,
      checks: {
        gemini: geminiCheck,
        database: databaseCheck,
        memory: memoryUsage,
      },
      environment: process.env.NODE_ENV || 'development',
    };

    const responseTime = Date.now() - startTime;

    // Set appropriate status code based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: getUptime(),
      checks: {
        gemini: {
          status: 'down',
          error: 'Health check failed',
        },
      },
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

/**
 * Handle HEAD requests for simple health checks
 */
export async function HEAD(request: NextRequest) {
  try {
    // Quick check - just verify basic functionality
    const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
    
    if (!geminiConfigured) {
      return new NextResponse(null, { status: 503 });
    }
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
