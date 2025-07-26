// API route for Gemini vision analysis
// This endpoint handles image analysis using Google's Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageWithGeminiPro } from '@/lib/gemini-vision-enhanced';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { imageUrl, additionalContext } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Analyze the image with Gemini AI
    console.log('🔍 Starting Gemini analysis for image:', imageUrl);
    
    const analysis = await analyzeImageWithGeminiPro(imageUrl, additionalContext || '');
    
    console.log('✅ Gemini analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('❌ Gemini vision analysis failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze images.' },
    { status: 405 }
  );
}
