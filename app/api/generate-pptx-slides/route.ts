// API route for generating PowerPoint slides
// This endpoint creates PPTX files from AI analysis

import { NextRequest, NextResponse } from 'next/server';
import { generatePresentationFromAnalysis } from '@/lib/slide-generator';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { analysis, imageUrl, additionalContext } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting slide generation from analysis...');
    
    // Generate presentation slides
    const presentation = await generatePresentationFromAnalysis(analysis);
    
    console.log('✅ Slide generation completed successfully');

    // For now, return the presentation data
    // In a real implementation, you'd generate an actual PPTX file
    return NextResponse.json({
      success: true,
      presentation,
      downloadUrl: `/viewer/${presentation.id}`, // Redirect to viewer
      message: 'Presentation generated successfully'
    });

  } catch (error) {
    console.error('❌ PPTX generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate presentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate slides.' },
    { status: 405 }
  );
}
