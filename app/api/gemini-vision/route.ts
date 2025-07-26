// API route for Gemini vision analysis
// This endpoint handles image analysis using Google's Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageWithGeminiPro } from '@/lib/gemini-vision-enhanced';

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Parse the FormData from the request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const theme = formData.get('theme') as string;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Convert the image file to a buffer for Gemini
    console.log('🔍 Starting Gemini analysis for uploaded image');
    console.log('📁 Image file details:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });
    
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const mimeType = imageFile.type || 'image/jpeg';
    
    // Build context from prompt and theme
    const additionalContext = `User prompt: ${prompt || 'Generate presentation slides'}. Theme: ${theme || 'professional'}`;
    
    console.log('🎯 Analysis context:', additionalContext);
    console.log('🔑 API Key present:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
    
    const analysis = await analyzeImageWithGeminiPro(imageBuffer, mimeType, additionalContext);
    
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
