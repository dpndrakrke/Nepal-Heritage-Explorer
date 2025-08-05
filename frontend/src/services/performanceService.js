class PerformanceService {
  constructor() {
    this.cache = new Map();
    this.imageCache = new Map();
    this.apiCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Debounce function for search inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Lazy load images
  lazyLoadImage(imgElement, src) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    observer.observe(imgElement);
  }

  // Preload critical images
  preloadImages(urls) {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // Cache API responses
  async cachedFetch(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = this.apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      this.apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Cached fetch error:', error);
      throw error;
    }
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    
    // Clear API cache
    for (const [key, value] of this.apiCache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.apiCache.delete(key);
      }
    }

    // Clear general cache
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  // Optimize images
  optimizeImageUrl(url, width = 800) {
    // Add image optimization parameters
    const optimizedUrl = new URL(url);
    optimizedUrl.searchParams.set('w', width);
    optimizedUrl.searchParams.set('q', '80');
    optimizedUrl.searchParams.set('f', 'auto');
    return optimizedUrl.toString();
  }

  // Compress data for storage
  compressData(data) {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (error) {
      console.error('Compression error:', error);
      return data;
    }
  }

  // Decompress data from storage
  decompressData(compressedData) {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression error:', error);
      return compressedData;
    }
  }

  // Store data in localStorage with compression
  storeData(key, data) {
    try {
      const compressed = this.compressData(data);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.error('Storage error:', error);
      // Fallback to uncompressed storage
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // Retrieve data from localStorage with decompression
  retrieveData(key) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      return this.decompressData(stored);
    } catch (error) {
      console.error('Retrieval error:', error);
      // Fallback to uncompressed retrieval
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    }
  }

  // Batch API requests
  async batchRequests(requests) {
    const promises = requests.map(request => 
      this.cachedFetch(request.url, request.options)
    );
    
    return Promise.allSettled(promises);
  }

  // Measure performance
  measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }

  // Async measure performance
  async measureAsyncPerformance(name, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }

  // Get memory usage
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Monitor performance
  startPerformanceMonitoring() {
    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });

    // Monitor memory usage
    setInterval(() => {
      const memory = this.getMemoryUsage();
      if (memory && memory.used > memory.limit * 0.8) {
        console.warn('High memory usage detected');
        this.clearExpiredCache();
      }
    }, 30000); // Check every 30 seconds
  }

  // Initialize performance optimizations
  initialize() {
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    // Clear expired cache periodically
    setInterval(() => {
      this.clearExpiredCache();
    }, 60000); // Clear every minute
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  // Preload critical resources
  preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/src/index.css';
    document.head.appendChild(criticalCSS);

    // Preload critical fonts (if using custom fonts)
    // const font = document.createElement('link');
    // font.rel = 'preload';
    // font.as = 'font';
    // font.href = '/fonts/inter-var.woff2';
    // font.crossOrigin = 'anonymous';
    // document.head.appendChild(font);
  }
}

export default new PerformanceService(); 