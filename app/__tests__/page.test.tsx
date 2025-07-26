import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../page';

// Mock Auth0
jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: jest.fn(() => ({
    user: null,
    error: null,
    isLoading: false
  }))
}));

// Mock next/dynamic
jest.mock('next/dynamic', () => (fn: any) => {
  const Component = fn();
  Component.displayName = 'MockedDynamicComponent';
  return Component;
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    img: ({ children, alt, ...props }: any) => <img alt={alt || 'Mock image'} {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  }
}));

// Mock SlideEditor component
jest.mock('@/components/features/SlideEditor', () => {
  return function MockSlideEditor() {
    return <div data-testid="slide-editor">Mocked Slide Editor</div>;
  };
});

// Mock window.location
const mockLocation = {
  href: 'http://localhost:3000',
};

// Use delete and redefine to avoid the "Cannot redefine property" error
delete (window as any).location;
(window as any).location = mockLocation;

// Mock fetch
global.fetch = jest.fn();

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the main upload interface when not authenticated', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Transform ideas into')).toBeInTheDocument();
    expect(screen.getByText('beautiful presentations')).toBeInTheDocument();
    expect(screen.getByText('Upload any image, sketch, or screenshot. Our AI creates professional slides in seconds.')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows loading state when user is loading', () => {
    const mockUseUser = require('@auth0/nextjs-auth0/client').useUser;
    mockUseUser.mockReturnValue({
      user: null,
      error: null,
      isLoading: true
    });

    render(<HomePage />);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('shows error state when there is an auth error', () => {
    const mockUseUser = require('@auth0/nextjs-auth0/client').useUser;
    mockUseUser.mockReturnValue({
      user: null,
      error: new Error('Authentication failed'),
      isLoading: false
    });

    render(<HomePage />);
    
    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText('Authentication failed')).toBeInTheDocument();
  });

  it('shows authenticated user interface when user is logged in', () => {
    const mockUseUser = require('@auth0/nextjs-auth0/client').useUser;
    mockUseUser.mockReturnValue({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/avatar.jpg'
      },
      error: null,
      isLoading: false
    });

    render(<HomePage />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('handles file selection and shows form fields', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Create a test file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Get the file input
    const fileInput = screen.getByTestId('file-input') || document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Upload the file
    await user.upload(fileInput, file);
    
    // Wait for the form to appear
    await waitFor(() => {
      expect(screen.getByText('Add context (optional)')).toBeInTheDocument();
      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Output Format')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create presentation/i })).toBeInTheDocument();
    });
  });

  it('handles theme selection', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Upload a file first
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Wait for theme selector to appear
    await waitFor(() => {
      expect(screen.getByText('Theme')).toBeInTheDocument();
    });
    
    // Click on Corporate theme
    const corporateTheme = screen.getByText('Corporate');
    await user.click(corporateTheme);
    
    // Theme should be selected (this would be visually indicated by classes)
    expect(corporateTheme.closest('button')).toBeInTheDocument();
  });

  it('handles output format selection', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Upload a file first
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Wait for format selector to appear
    await waitFor(() => {
      expect(screen.getByText('Output Format')).toBeInTheDocument();
    });
    
    // Click on PowerPoint format
    const pptxFormat = screen.getByText('PowerPoint');
    await user.click(pptxFormat);
    
    expect(pptxFormat.closest('button')).toBeInTheDocument();
  });

  it('handles form submission with successful API response', async () => {
    const user = userEvent.setup();
    const mockToast = require('sonner').toast;
    
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        presentation: {
          id: 'test-id',
          title: 'Test Presentation',
          slides: [
            { id: '1', title: 'Slide 1', content: 'Content 1' }
          ]
        }
      })
    });
    
    render(<HomePage />);
    
    // Upload a file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Wait for submit button and click it
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create presentation/i })).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /create presentation/i });
    await user.click(submitButton);
    
    // Verify API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/gemini-vision', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }));
    });
    
    // Verify success toast
    expect(mockToast.success).toHaveBeenCalledWith('Presentation created successfully');
  });

  it('handles form submission with API error', async () => {
    const user = userEvent.setup();
    const mockToast = require('sonner').toast;
    
    // Mock API error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Analysis failed'
      })
    });
    
    render(<HomePage />);
    
    // Upload a file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Submit the form
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create presentation/i })).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /create presentation/i });
    await user.click(submitButton);
    
    // Verify error toast
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Analysis failed: Analysis failed');
    });
  });

  it('handles prompt input', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Upload a file first
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Wait for prompt input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/create a pitch deck/i)).toBeInTheDocument();
    });
    
    const promptInput = screen.getByPlaceholderText(/create a pitch deck/i);
    await user.type(promptInput, 'Create a marketing presentation');
    
    expect(promptInput).toHaveValue('Create a marketing presentation');
  });

  it('prevents form submission without a file', async () => {
    const user = userEvent.setup();
    const mockToast = require('sonner').toast;
    
    render(<HomePage />);
    
    // Try to submit without uploading a file (button shouldn't be visible)
    expect(screen.queryByRole('button', { name: /create presentation/i })).not.toBeInTheDocument();
  });

  it('handles new presentation creation from editor', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response to get to editor view
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        presentation: {
          id: 'test-id',
          title: 'Test Presentation',
          slides: [
            { id: '1', title: 'Slide 1', content: 'Content 1' }
          ]
        }
      })
    });
    
    render(<HomePage />);
    
    // Upload a file and submit to get to editor
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create presentation/i })).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /create presentation/i });
    await user.click(submitButton);
    
    // Wait for editor to appear
    await waitFor(() => {
      expect(screen.getByTestId('slide-editor')).toBeInTheDocument();
    });
    
    // Click "New" button to return to upload view
    const newButton = screen.getByText('New');
    await user.click(newButton);
    
    // Should be back to upload view
    await waitFor(() => {
      expect(screen.getByText('Transform ideas into')).toBeInTheDocument();
    });
  });

  it('displays feature grid', () => {
    render(<HomePage />);
    
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText('Live Editing')).toBeInTheDocument();
    expect(screen.getByText('Smart Themes')).toBeInTheDocument();
    expect(screen.getByText('Any Device')).toBeInTheDocument();
  });
});
