'use client';

import type { SlidePresentation } from '@/types/slides';

/**
 * Slide editor component for customizing presentation content
 * This is where users can fine-tune their AI-generated slides
 */

interface SlideEditorProps {
  presentation: SlidePresentation;
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onContentUpdate: () => void;
  onPresentationUpdate: () => void;
}

export default function SlideEditor({
  presentation,
  currentSlideIndex,
  onSlideChange,
  onContentUpdate,
  onPresentationUpdate
}: SlideEditorProps) {
  const currentSlide = presentation.slides[currentSlideIndex];
  
  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No slides available to edit</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Slide Editor
        </h3>
        <p className="text-sm text-gray-600">
          Slide {currentSlideIndex + 1} of {presentation.slides.length}
        </p>
      </div>
      
      {/* Current Slide Content */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-[400px]">
        <div className="space-y-6">
          {currentSlide.contents.map((content) => {
            switch (content.type) {
              case 'title':
                return (
                  <div key={content.id}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                      {content.content}
                    </h1>
                  </div>
                );
              
              case 'text':
                return (
                  <div key={content.id} className="bg-white/70 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed">
                      {content.content}
                    </p>
                  </div>
                );
              
              case 'bullet':
                return (
                  <div key={content.id} className="bg-white/70 rounded-lg p-2 ml-4">
                    <div className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-800">{content.content}</span>
                    </div>
                  </div>
                );
              
              default:
                return (
                  <div key={content.id} className="bg-white/70 rounded-lg p-4">
                    <p className="text-gray-800">{content.content}</p>
                  </div>
                );
            }
          })}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          ← Previous
        </button>
        
        <div className="flex space-x-2">
          {presentation.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlideIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => onSlideChange(Math.min(presentation.slides.length - 1, currentSlideIndex + 1))}
          disabled={currentSlideIndex === presentation.slides.length - 1}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}