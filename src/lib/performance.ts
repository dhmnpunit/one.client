/**
 * Performance utilities for monitoring and optimizing application performance
 */

// Web vitals metric interface
interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

/**
 * Reports web vitals metrics to an analytics service
 * @param metric The web vital metric to report
 */
export const reportWebVitals = (metric: WebVitalMetric) => {
  // Send to your analytics service if implemented
  // Example: sendToAnalytics(metric);
  
  // Silently collect metrics without logging in production
};

/**
 * Defers non-critical operations until after page load
 * @param callback Function to run after page is interactive
 * @param timeout Optional timeout in ms (default: 0, meaning next event loop)
 */
export const deferAfterInteractive = (callback: () => void, timeout = 0) => {
  if (typeof window === 'undefined') return; // Add check for server-side rendering

  if (document.readyState === 'complete') {
    setTimeout(callback, timeout);
  } else {
    window.addEventListener('load', () => {
      setTimeout(callback, timeout);
    });
  }
};

/**
 * Prefetches resources to improve perceived performance
 * @param urls Array of URLs to prefetch
 */
export const prefetchResources = (urls: string[]) => {
  if (typeof window === 'undefined') return; // Add check for server-side rendering
  
  deferAfterInteractive(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, 200);
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttles a function to limit the rate at which it can fire
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}; 