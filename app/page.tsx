'use client';

// Main home page for Snap2Slides - where users upload images and create presentations
// This is the heart of our app, designed to be simple but powerful

import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Types and interfaces
import type { SlidePresentation } from '@/types/slides';

// Custom hooks for features
import { useKeyboardShortcuts, SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

// UI Components
import ProgressBar from '@/components/ui/ProgressBar';
import HelpModal from '@/components/ui/HelpModal';

// Dynamic import for AIFeaturesShowcase to avoid build issues
const AIFeaturesShowcase = dynamic(() => import('@/components/features/AIFeaturesShowcase'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />,
  ssr: false
});

// Beautiful background that works in light and dark mode
// Inspired by Apple's design language - subtle but elegant
const MinimalBackground = () => (
  <div className="fixed inset-0 -z-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800" />
    {/* Floating orbs for visual interest */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
);

// Load the slide editor only when needed - helps with performance
const SlideEditor = dynamic(() => import('@/components/features/SlideEditor'), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
    </div>
  ),
  ssr: false // Don't render on server - this component needs browser APIs
});

// Simple theme management - users can switch between light and dark
const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Load saved theme from browser storage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return [theme, setTheme] as const;
};

// Apple-style Auth Header with refined typography
const AuthHeader: React.FC<{ user: any }> = ({ user }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-3 sm:top-6 right-3 sm:right-6 z-50 flex items-center space-x-2 sm:space-x-3"
  >
    {user ? (
      <div className="flex items-center space-x-2 sm:space-x-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl shadow-lg">
        {user.picture && (
          <motion.img 
            src={user.picture} 
            alt={`${user.name || 'User'} profile picture`}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            loading="lazy"
            width={32}
            height={32}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
        <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate">
          {user.name || user.email || "User"}
        </span>
        <button
          onClick={() => window.location.href = '/api/auth/logout'}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 hidden sm:block"
        >
          Sign out
        </button>
        <button
          onClick={() => window.location.href = '/api/auth/logout'}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 sm:hidden"
        >
          ←
        </button>
      </div>
    ) : (
      <button
        onClick={() => window.location.href = '/api/auth/login'}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
      >
        Sign in
      </button>
    )}
  </motion.div>
);

const LoadingState = () => (
  <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black">
    <MinimalBackground />
    <div className="relative z-10 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Loading</h2>
      </motion.div>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black">
    <MinimalBackground />
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-2xl text-center max-w-md"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Authentication Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => window.location.href = '/api/auth/login'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all duration-200"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  </div>
);

// Simple dropzone component
const EnhancedDropzone: React.FC<{
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}> = ({ onFileSelect, selectedFile, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => {
      // More permissive image type checking
      return file.type.startsWith('image/') || 
             /\.(jpg|jpeg|png|webp|gif|bmp|tiff)$/i.test(file.name);
    });
    
    if (imageFile) {
      // Simplified validation - just check size
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (imageFile.size > maxSize) {
        toast.error('File size too large. Please upload an image smaller than 10MB.');
        return;
      }
      
      onFileSelect(imageFile);
    } else {
      toast.error('Please drop an image file');
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simplified validation - just check size
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        toast.error('File size too large. Please upload an image smaller than 10MB.');
        return;
      }
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} touch-manipulation`}
    >
      <input
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {selectedFile ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{selectedFile.name}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
              Drop your image here
            </p>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              or tap to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple theme selector
const ThemeSelector: React.FC<{
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  disabled?: boolean;
}> = ({ selectedTheme, onThemeChange, disabled }) => {
  const themes = [
    { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-100' },
    { id: 'corporate', name: 'Corporate', color: 'bg-blue-100' },
    { id: 'creative', name: 'Creative', color: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Theme
      </label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onThemeChange(theme.id)}
            disabled={disabled}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
              selectedTheme === theme.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className={`w-full h-6 sm:h-8 ${theme.color} rounded mb-1 sm:mb-2`} />
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {theme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Simple output format selector
const OutputFormatSelector: React.FC<{
  selectedFormat: 'pptx' | 'interactive';
  onFormatChange: (format: 'pptx' | 'interactive') => void;
  disabled?: boolean;
}> = ({ selectedFormat, onFormatChange, disabled }) => {
  const formats = [
    { id: 'interactive' as const, name: 'Interactive', icon: '💻' },
    { id: 'pptx' as const, name: 'PowerPoint', icon: '📊' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Output Format
      </label>
      <div className="grid grid-cols-2 gap-2">
        {formats.map((format) => (
          <button
            key={format.id}
            type="button"
            onClick={() => onFormatChange(format.id)}
            disabled={disabled}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center touch-manipulation ${
              selectedFormat === format.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">{format.icon}</div>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {format.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  // Auth state
  const { user, error: userError, isLoading: userLoading } = useUser();

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [slideTheme, setSlideTheme] = useState<string>('minimalist');
  const [outputFormat, setOutputFormat] = useState<'pptx' | 'interactive'>('interactive');
  const [theme, setTheme] = useTheme();

  // App state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPresentation, setCurrentPresentation] = useState<SlidePresentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'upload' | 'editor'>('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Handlers
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
    setCurrentPresentation(null);
    setViewMode('upload');
  }, []);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file first');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Progress tracking
      setAnalysisProgress(10);
      toast.loading('Analyzing your image...', { id: 'analysis' });
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('prompt', prompt);
      formData.append('theme', slideTheme);
      
      setAnalysisProgress(30);
      
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        body: formData,
      });
      
      setAnalysisProgress(60);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      setAnalysisProgress(80);
      
      const result = await response.json();
      if (result.success) {
        setAnalysisProgress(100);
        setCurrentPresentation(result.presentation);
        setCurrentSlideIndex(0);
        setViewMode('editor');
        toast.success('Presentation created successfully', { id: 'analysis' });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(`Analysis failed: ${errorMessage}`, { id: 'analysis' });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [selectedFile, prompt, slideTheme]);

  const handleNewPresentation = useCallback(() => {
    setCurrentPresentation(null);
    setSelectedFile(null);
    setPrompt('');
    setError(null);
    setViewMode('upload');
    setCurrentSlideIndex(0);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [SHORTCUTS.NEW]: handleNewPresentation,
    [SHORTCUTS.SAVE]: () => currentPresentation && toast.info('Auto-save enabled'),
    [SHORTCUTS.PRESENT]: () => viewMode === 'editor' && toast.info('Press F5 in editor to present'),
    [SHORTCUTS.HELP]: () => setShowHelpModal(true)
  }, { enabled: !isAnalyzing });

  // Loading and error states
  if (userLoading) return <LoadingState />;
  if (userError) return <ErrorState error={userError.message} />;

  // Editor view - Apple-style presentation editor
  if (viewMode === 'editor' && currentPresentation) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
        <MinimalBackground />
        <AuthHeader user={user} />
        
        {/* Header */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                onClick={handleNewPresentation}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-xs sm:text-sm">New</span>
              </motion.button>
              <h1 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                {currentPresentation.title}
              </h1>
            </div>
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <span className="text-sm sm:text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        {/* Slide Editor */}
        <div className="h-[calc(100vh-60px)] sm:h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl sm:rounded-3xl p-4 sm:p-8 min-h-[500px] sm:min-h-[600px]">
                <SlideEditor
                  presentation={currentPresentation}
                  currentSlideIndex={currentSlideIndex}
                  onSlideChange={setCurrentSlideIndex}
                  onContentUpdate={() => {}}
                  onPresentationUpdate={() => {}}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Help Modal */}
        <HelpModal 
          isOpen={showHelpModal} 
          onClose={() => setShowHelpModal(false)} 
        />
      </div>
    );
  }

  // Upload view - Apple-style minimal design
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <MinimalBackground />
      <AuthHeader user={user} />
      
      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-8 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 dark:text-white mb-4 sm:mb-8 leading-tight px-4">
            Transform ideas into
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium tracking-tight mb-4 sm:mb-8 leading-tight px-4">
            beautiful presentations
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed max-w-2xl mx-auto px-4">
            Upload any image, sketch, or screenshot. Our AI creates professional slides in seconds.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl mx-auto px-4"
        >
          <form onSubmit={handleAnalyze} className="space-y-6 sm:space-y-8">
            {/* Apple-style Dropzone */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative group"
            >
              <EnhancedDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                disabled={isAnalyzing}
              />
            </motion.div>

            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Context Input */}
                  <div className="space-y-3">
                    <label htmlFor="prompt" className="block text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                      Add context (optional)
                    </label>
                    <textarea
                      id="prompt"
                      rows={3}
                      value={prompt}
                      onChange={handlePromptChange}
                      placeholder="e.g., Create a pitch deck for our AI startup"
                      className="w-full px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 text-sm sm:text-base"
                      maxLength={500}
                      disabled={isAnalyzing}
                    />
                  </div>

                  {/* Theme & Format Selectors */}
                  <div className="grid grid-cols-1 gap-4">
                    <ThemeSelector
                      selectedTheme={slideTheme}
                      onThemeChange={setSlideTheme}
                      disabled={isAnalyzing}
                    />
                    <OutputFormatSelector
                      selectedFormat={outputFormat}
                      onFormatChange={setOutputFormat}
                      disabled={isAnalyzing}
                    />
                  </div>

                  {/* Analysis Progress */}
                  {isAnalyzing && analysisProgress > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <ProgressBar 
                        progress={analysisProgress} 
                        label="Creating your presentation" 
                        className="w-full"
                      />
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <motion.button
                    type="submit"
                    disabled={!selectedFile || isAnalyzing}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                    whileHover={{ scale: !selectedFile || isAnalyzing ? 1 : 1.02 }}
                    whileTap={{ scale: !selectedFile || isAnalyzing ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating slides...</span>
                      </div>
                    ) : (
                      'Create presentation'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl" 
                  role="alert"
                >
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4"
        >
          {[
            { icon: '🎯', label: 'AI Analysis' },
            { icon: '✏️', label: 'Live Editing' },
            { icon: '🎨', label: 'Smart Themes' },
            { icon: '📱', label: 'Any Device' }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="text-center group"
            >
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {feature.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Features Showcase */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 sm:mt-24 w-full"
        >
          <AIFeaturesShowcase />
        </motion.div>
      </main>
      
      {/* Help Modal */}
      <HelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </div>
  );
}
