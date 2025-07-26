// Performance monitoring and analytics utilities
// Helps track performance metrics and user interactions

import React from 'react';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  readonly name: string;
  readonly value: number;
  readonly unit: 'ms' | 'bytes' | 'count' | 'percentage';
  readonly timestamp: number;
  readonly metadata: Record<string, unknown> | undefined;
}

/**
 * User interaction tracking
 */
export interface UserInteraction {
  readonly event: string;
  readonly timestamp: number;
  readonly userId: string | undefined;
  readonly sessionId: string;
  readonly metadata: Record<string, unknown> | undefined;
}

/**
 * Performance monitor class for tracking metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private interactions: UserInteraction[] = [];
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    
    // Listen for navigation timing
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.trackLoadPerformance();
      });
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Track a performance metric
   */
  public trackMetric(
    name: string, 
    value: number, 
    unit: PerformanceMetrics['unit'] = 'ms',
    metadata?: Record<string, unknown>
  ): void {
    const metric: PerformanceMetrics = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value}${unit}`, metadata);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('performance', metric);
    }
  }

  /**
   * Track user interaction
   */
  public trackInteraction(
    event: string,
    metadata?: Record<string, unknown>,
    userId?: string
  ): void {
    const interaction: UserInteraction = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId,
      metadata,
    };

    this.interactions.push(interaction);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`👤 Interaction: ${event}`, metadata);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('interaction', interaction);
    }
  }

  /**
   * Track component render performance
   */
  public trackComponentRender(componentName: string, renderTime: number): void {
    this.trackMetric(`component_render_${componentName}`, renderTime, 'ms', {
      component: componentName,
      type: 'render',
    });
  }

  /**
   * Track API call performance
   */
  public trackApiCall(
    endpoint: string, 
    duration: number, 
    status: number,
    method: string = 'GET'
  ): void {
    this.trackMetric(`api_call_${endpoint}`, duration, 'ms', {
      endpoint,
      status,
      method,
      type: 'api',
    });
  }

  /**
   * Track memory usage
   */
  public trackMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.trackMetric('memory_used', memory.usedJSHeapSize, 'bytes');
      this.trackMetric('memory_total', memory.totalJSHeapSize, 'bytes');
      this.trackMetric('memory_limit', memory.jsHeapSizeLimit, 'bytes');
    }
  }

  /**
   * Track Core Web Vitals
   */
  public trackWebVitals(): void {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.trackMetric('lcp', lastEntry.startTime, 'ms', { type: 'web_vital' });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Type assertion for first-input entries
        const firstInputEntry = entry as any;
        if (firstInputEntry.processingStart) {
          this.trackMetric('fid', firstInputEntry.processingStart - firstInputEntry.startTime, 'ms', { 
            type: 'web_vital' 
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.trackMetric('cls', clsValue, 'count', { type: 'web_vital' });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track page load performance
   */
  private trackLoadPerformance(): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.trackMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms');
      this.trackMetric('dom_ready', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
      this.trackMetric('first_byte', navigation.responseStart - navigation.fetchStart, 'ms');
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send metrics to analytics service
   */
  private sendToAnalytics(type: 'performance' | 'interaction', data: any): void {
    // In a real application, send to your analytics service
    // For now, we'll just batch and potentially send to console
    
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        const payload = JSON.stringify({ type, data });
        // Replace with your analytics endpoint
        // navigator.sendBeacon('/api/analytics', payload);
      } catch (error) {
        console.warn('Failed to send analytics:', error);
      }
    }
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    metrics: PerformanceMetrics[];
    interactions: UserInteraction[];
    summary: Record<string, number>;
  } {
    const summary = this.metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value;
      return acc;
    }, {} as Record<string, number>);

    return {
      metrics: [...this.metrics],
      interactions: [...this.interactions],
      summary,
    };
  }

  /**
   * Clear collected data
   */
  public clear(): void {
    this.metrics = [];
    this.interactions = [];
  }
}

/**
 * HOC for tracking component performance
 */
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  const WithPerformanceTracking = (props: P) => {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        monitor.trackComponentRender(componentName, endTime - startTime);
      };
    }, [monitor]);

    return React.createElement(WrappedComponent, props);
  };

  WithPerformanceTracking.displayName = `withPerformanceTracking(${componentName})`;
  return WithPerformanceTracking;
}

/**
 * Hook for tracking performance in functional components
 */
export function usePerformanceTracking(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      monitor.trackComponentRender(componentName, endTime - startTime);
    };
  }, [componentName, monitor]);

  return {
    trackMetric: monitor.trackMetric.bind(monitor),
    trackInteraction: monitor.trackInteraction.bind(monitor),
    trackApiCall: monitor.trackApiCall.bind(monitor),
  };
}

/**
 * Utility for measuring function execution time
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    monitor.trackMetric(name, endTime - startTime, 'ms');
    return result;
  } catch (error) {
    const endTime = performance.now();
    monitor.trackMetric(`${name}_error`, endTime - startTime, 'ms', { error: true });
    throw error;
  }
}

/**
 * Utility for measuring synchronous function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const monitor = PerformanceMonitor.getInstance();
  const startTime = performance.now();
  
  try {
    const result = fn();
    const endTime = performance.now();
    monitor.trackMetric(name, endTime - startTime, 'ms');
    return result;
  } catch (error) {
    const endTime = performance.now();
    monitor.trackMetric(`${name}_error`, endTime - startTime, 'ms', { error: true });
    throw error;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
