// hooks/useSlideGeneration.ts
'use client';

import { useState, useCallback } from 'react';

// Simple input sanitization function
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .substring(0, 1000);
}

interface GenerationState {
  isLoading: boolean;
  error: string | null;
  outputLink: string | null;
}

interface GenerationData {
  file: File;
  prompt: string;
  theme: string;
  outputFormat: 'pptx' | 'interactive';
  user: any;
}

export const useSlideGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    outputLink: null
  });

  const resetState = useCallback(() => {
    setState({ isLoading: false, error: null, outputLink: null });
  }, []);

  const generateSlides = useCallback(async ({ 
    file, 
    prompt, 
    theme, 
    outputFormat, 
    user 
  }: GenerationData) => {
    setState({ isLoading: true, error: null, outputLink: null });

    try {
      // Sanitize inputs
      const sanitizedPrompt = sanitizeInput(prompt);
      
      // Step 1: Upload Image to Google Cloud Storage
      const imageFormData = new FormData();
      imageFormData.append('file', file);

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Image upload failed');
      }

      const { imageUrl: gcsImageUrl } = await uploadResponse.json();

      // Step 2: Process with Gemini AI
      const geminiFormData = new FormData();
      geminiFormData.append('file', file);
      geminiFormData.append('prompt', sanitizedPrompt);
      geminiFormData.append('theme', theme);

      const geminiResponse = await fetch('/api/gemini-vision', {
        method: 'POST',
        body: geminiFormData,
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(errorData.error || 'AI processing failed');
      }

      const geminiResult = await geminiResponse.json();
      const structuredContent = geminiResult.data;

      let finalOutputLink = '';

      // Step 3: Generate presentation
      if (outputFormat === 'pptx') {
        const pptxResponse = await fetch('/api/generate-pptx-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: structuredContent,
            selectedTheme: theme,
          }),
        });

        if (!pptxResponse.ok) {
          const errorData = await pptxResponse.json();
          throw new Error(errorData.error || 'PPTX generation failed');
        }

        const pptxBlob = await pptxResponse.blob();
        finalOutputLink = URL.createObjectURL(pptxBlob);
      }

      // Step 4: Save to history
      const historySaveResponse = await fetch('/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputImageUrl: gcsImageUrl,
          generatedSlidesUrl: outputFormat === 'pptx' ? finalOutputLink : null,
          summary: structuredContent.overallSummary,
          themeUsed: theme,
          slideContentDetails: structuredContent.slideContent,
          outputType: outputFormat,
          userId: user?.sub,
        }),
      });

      if (!historySaveResponse.ok) {
        console.warn('Failed to save history');
      } else {
        const historyResult = await historySaveResponse.json();
        if (outputFormat === 'interactive') {
          finalOutputLink = `/viewer/${historyResult.data._id}`;
        }
      }

      setState({ isLoading: false, error: null, outputLink: finalOutputLink });
      return { success: true, outputLink: finalOutputLink };

    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({ isLoading: false, error: errorMessage, outputLink: null });
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    ...state,
    generateSlides,
    resetState
  };
};
