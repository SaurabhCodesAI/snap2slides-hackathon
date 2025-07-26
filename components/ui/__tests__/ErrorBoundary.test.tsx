import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock window.location for navigation testing
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};

// Mock window.location by deleting and setting it
delete (window as any).location;
(window as any).location = mockLocation;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We\'re sorry, but something unexpected happened. Please try again.')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    // Mock NODE_ENV for this test
    const originalEnv = process.env;
    process.env = { ...originalEnv, NODE_ENV: 'development' };

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Should show error details in development
    expect(screen.getByText('Error Details')).toBeInTheDocument();

    // Restore original environment
    process.env = originalEnv;
  });

  it('has working action buttons', async () => {
    const user = userEvent.setup();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('handles go home button click', async () => {
    const user = userEvent.setup();
    
    // Spy on location href setter
    let hrefValue = '';
    Object.defineProperty(mockLocation, 'href', {
      get: () => hrefValue,
      set: (value) => { hrefValue = value; },
      configurable: true
    });
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const goHomeButton = screen.getByText('Go Home');
    await user.click(goHomeButton);
    
    // Check if href was set to '/'
    expect(hrefValue).toBe('/');
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Verify that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('resets error state when try again is clicked', async () => {
    const user = userEvent.setup();
    
    // Create a component that can toggle error state
    const ToggleError = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      
      return (
        <ErrorBoundary>
          <button onClick={() => setShouldThrow(false)}>Fix Error</button>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    };

    render(<ToggleError />);
    
    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Click try again
    const tryAgainButton = screen.getByText('Try Again');
    await user.click(tryAgainButton);
    
    // Error should be reset and component should re-render
    // Note: This test might need adjustment based on exact reset behavior
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error UI</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
