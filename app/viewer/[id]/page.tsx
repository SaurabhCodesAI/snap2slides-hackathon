// app/viewer/[id]/page.tsx
// This page displays an interactive, web-based presentation based on content ID.
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // For accessing dynamic route parameters.
import Link from 'next/link'; // For linking back to home.
// import { useUser } from '@auth0/nextjs-auth0/client'; // Not directly needed in viewer if data is public/passed

export default function PresentationViewerPage() {
  const params = useParams();
  const contentId = params.id as string; // Get the ID from the URL.

  // State to hold the presentation data fetched from MongoDB.
  const [presentationData, setPresentationData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State to manage the current slide being viewed.
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!contentId) {
      setError('Presentation ID is missing from the URL.');
      setIsLoading(false);
      return;
    }

    // Function to fetch the specific presentation content from history by ID.
    const fetchPresentationContent = async () => {
      try {
        // Call the history API to fetch a single record by its ID.
        const response = await fetch(`/api/history?id=${contentId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load presentation content from history.');
        }
        const result = await response.json();

        // Check if the fetched data and its slide content are valid.
        if (result.data && result.data.slideContentDetails && Array.isArray(result.data.slideContentDetails)) {
          setPresentationData(result.data); // Store the entire conversion record.
        } else {
          throw new Error('No valid presentation content found for this ID in history.');
        }
      } catch (err: any) {
        console.error('Error fetching presentation content:', err);
        setError(err.message || 'Could not load presentation data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresentationContent(); // Execute fetch when contentId changes.
  }, [contentId]); // Re-run effect if contentId changes.

  // Define dynamic styling for the viewer based on the stored theme.
  // This needs to be consistent with themes defined in pptxgenjs.
  const themeColors: { [key: string]: { bg: string; text: string; bullet: string; accent: string } } = {
    minimalist: { bg: '#ffffff', text: '#1e293b', bullet: '#475569', accent: '#3b82f6' },
    dark: { bg: '#1e293b', text: '#f8fafc', bullet: '#cbd5e1', accent: '#60a5fa' },
    colorful: { bg: '#ecfdf5', text: '#065f46', bullet: '#10b981', accent: '#fbbf24' },
  };
  // Attempt to get the theme from fetched data, defaulting to minimalist if not available.
  const viewerTheme = themeColors[presentationData?.themeUsed || 'minimalist'] || themeColors.minimalist;


  // Render loading state.
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Presentation</h2>
          <p className="text-white/80">Preparing your immersive experience...</p>
        </div>
      </div>
    );
  }

  // Render error state.
  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-pink-900 to-orange-900">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Presentation Error</h2>
            <p className="text-white/90 mb-6">{error}</p>
            <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where no valid presentation data is found.
  if (!presentationData || !presentationData.slideContentDetails || presentationData.slideContentDetails.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl text-center max-w-md">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">No Content Found</h2>
            <p className="text-white/90 mb-6">Could not find presentation data for this ID. It might have been removed or the link is invalid.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Access the actual slide content.
  const slides = presentationData.slideContentDetails;
  const currentSlide = slides[currentSlideIndex];

  // Navigate between slides.
  const navigateSlides = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Enhanced theme colors for immersive experience
  const getThemeBackground = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'from-gray-900 via-blue-900 to-indigo-900';
      case 'colorful':
        return 'from-pink-900 via-purple-900 to-indigo-900';
      default: // minimalist
        return 'from-slate-900 via-blue-900 to-indigo-900';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getThemeBackground(presentationData?.themeUsed || 'minimalist')}`}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        {/* Floating orbs animation */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Navigation Header */}
        <div className="fixed top-6 left-6 z-50">
          <Link href="/" className="inline-flex items-center px-6 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 font-semibold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Slide Counter */}
        <div className="fixed top-6 right-6 z-50 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-2xl shadow-2xl">
          <span className="text-white font-semibold">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Main Slide Container */}
        <div className="w-full max-w-6xl relative">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 min-h-[600px] flex flex-col justify-center transform transition-all duration-500 hover:scale-[1.01]">
            
            {/* Navigation Arrows */}
            <button
              onClick={() => navigateSlides('prev')}
              disabled={currentSlideIndex === 0}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => navigateSlides('next')}
              disabled={currentSlideIndex === slides.length - 1}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Content */}
            <div className="text-center px-16">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-12 leading-tight">
                {currentSlide.title || "Untitled Slide"}
              </h1>
              
              <div className="space-y-8 text-left max-w-4xl mx-auto">
                {currentSlide.bulletPoints?.map((point: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-start group animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-6 mt-3 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                    <p className="text-2xl text-white/90 leading-relaxed font-light group-hover:text-white transition-colors duration-300">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {slides.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentSlideIndex 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Presentation Info */}
        {presentationData?.summary && (
          <div className="mt-12 max-w-2xl text-center">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Presentation Summary</h3>
              <p className="text-white/80 leading-relaxed">{presentationData.summary}</p>
              {presentationData.themeUsed && (
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-200 rounded-full text-sm font-medium">
                    Theme: {presentationData.themeUsed}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}