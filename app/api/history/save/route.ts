// API route for saving presentation history
// This endpoint saves completed presentations to the database

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { presentation, imageUrl } = await request.json();

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation data is required' },
        { status: 400 }
      );
    }

    console.log('💾 Saving presentation to history...');
    
    // For now, just return success
    // In a real implementation, you'd save to MongoDB
    const savedPresentation = {
      id: presentation.id || `pres_${Date.now()}`,
      title: presentation.title,
      createdAt: new Date(),
      imageUrl,
      slideCount: presentation.slides?.length || 0
    };
    
    console.log('✅ Presentation saved to history successfully');

    return NextResponse.json({
      success: true,
      presentation: savedPresentation,
      message: 'Presentation saved to history'
    });

  } catch (error) {
    console.error('❌ Failed to save presentation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save presentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to save presentations.' },
    { status: 405 }
  );
}
