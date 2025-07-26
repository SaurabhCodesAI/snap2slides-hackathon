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
      const structuredContent = geminiResult.analysis; // Updated to match the API response structure

      let finalOutputLink = '';

      // Step 3: Generate presentation
      if (outputFormat === 'pptx') {
        // Create the same presentation structure as the interactive version
        const sections = structuredContent?.structuredContent?.sections || [];
        const slides = sections.map((section: any, index: number) => {
          const contents: any[] = [];
          
          // Add title content (API returns 'heading', not 'title')
          contents.push({
            id: `title-${index}`,
            type: 'title',
            content: section.heading || section.title || `Slide ${index + 1}`,
            position: { x: 0, y: 0 },
            style: { fontSize: '2rem', fontWeight: 'bold', alignment: 'center' }
          });
          
          // Add main content if available
          if (section.content) {
            contents.push({
              id: `content-${index}`,
              type: 'text',
              content: section.content,
              position: { x: 0, y: 100 },
              style: { fontSize: '1.2rem', alignment: 'left' }
            });
          }
          
          // Add bullet points if available (API returns 'bullets', not 'bulletPoints')
          const bulletPoints = section.bullets || section.bulletPoints || [];
          if (bulletPoints && bulletPoints.length > 0) {
            bulletPoints.forEach((point: string, bulletIndex: number) => {
              contents.push({
                id: `bullet-${index}-${bulletIndex}`,
                type: 'bullet',
                content: point,
                position: { x: 20, y: 200 + (bulletIndex * 40) },
                style: { fontSize: '1rem', alignment: 'left' }
              });
            });
          }
          
          return {
            id: `slide-${index}`,
            title: section.heading || section.title || `Slide ${index + 1}`,
            contents: contents,
            theme: {
              id: theme || 'modern',
              name: theme || 'modern',
              colors: {
                primary: '#3B82F6',
                secondary: '#1E40AF',
                accent: '#EF4444',
                background: '#FFFFFF',
                text: '#1F2937'
              },
              fonts: {
                heading: 'Inter',
                body: 'Inter'
              },
              layout: 'modern' as const
            }
          };
        });

        const presentationData = {
          id: Date.now().toString(),
          title: structuredContent?.structuredContent?.title || 'My Presentation',
          slides: slides,
          theme: {
            id: theme || 'modern',
            name: theme || 'modern',
            colors: {
              primary: '#3B82F6',
              secondary: '#1E40AF',
              accent: '#EF4444',
              background: '#FFFFFF',
              text: '#1F2937'
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter'
            },
            layout: 'modern' as const
          },
          metadata: {
            created: new Date(),
            updated: new Date(),
            author: 'Snap2Slides User',
            description: structuredContent?.structuredContent?.introduction || 'Generated presentation'
          },
          settings: {
            autoAdvance: false,
            timing: 5000
          }
        };

        const pptxResponse = await fetch('/api/generate-pptx-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            presentation: presentationData,
          }),
        });

        console.log('📡 PowerPoint API response status:', pptxResponse.status);
        console.log('📋 Response headers:', Object.fromEntries(pptxResponse.headers.entries()));

        if (!pptxResponse.ok) {
          const errorData = await pptxResponse.json();
          console.error('❌ PowerPoint generation error:', errorData);
          throw new Error(errorData.error || 'PPTX generation failed');
        }

        console.log('📦 Converting response to blob...');
        const pptxBlob = await pptxResponse.blob();
        console.log('📊 Blob size:', pptxBlob.size, 'bytes');
        console.log('📋 Blob type:', pptxBlob.type);
        
        finalOutputLink = URL.createObjectURL(pptxBlob);
        console.log('🔗 Created download URL:', finalOutputLink);
        
        // Trigger download immediately
        const downloadLink = document.createElement('a');
        downloadLink.href = finalOutputLink;
        downloadLink.download = `${presentationData.title}.pptx`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        console.log('📥 Download triggered');
      }

      // Step 4: Save to history
      const historySaveResponse = await fetch('/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputImageUrl: gcsImageUrl,
          generatedSlidesUrl: outputFormat === 'pptx' ? finalOutputLink : null,
          summary: structuredContent?.structuredContent?.title || 'Generated Presentation',
          themeUsed: theme,
          slideContentDetails: structuredContent?.structuredContent || {},
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
