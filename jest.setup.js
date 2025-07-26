// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Auth0
jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: () => ({
    user: null,
    error: null,
    isLoading: false,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock URL methods
if (typeof global.URL === 'undefined') {
  global.URL = class URL {
    constructor(url) {
      this.href = url;
    }
    static createObjectURL = jest.fn(() => 'mock-url');
    static revokeObjectURL = jest.fn();
  };
} else {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
  global.URL.revokeObjectURL = jest.fn();
}

// Mock File API
global.File = class MockFile {
  constructor(parts, filename, properties = {}) {
    this.parts = parts;
    this.name = filename;
    this.size = properties.size || parts.reduce((acc, part) => acc + (part.length || 0), 0);
    this.type = properties.type || '';
    this.lastModified = properties.lastModified || Date.now();
  }
};

// Mock FileReader
global.FileReader = class MockFileReader {
  constructor() {
    this.readAsDataURL = jest.fn();
    this.result = '';
    this.onload = null;
    this.onerror = null;
  }
  
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
};

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
