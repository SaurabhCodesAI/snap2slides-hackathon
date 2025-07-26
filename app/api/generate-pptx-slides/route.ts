// API route for generating PowerPoint slides
// This endpoint creates PPTX files from AI analysis

import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 PowerPoint generation request received');
    
    // Parse the request body
    const requestBody = await request.json();
    console.log('📋 Request body keys:', Object.keys(requestBody));
    
    const { presentation } = requestBody;

    if (!presentation || !presentation.slides) {
      console.log('❌ Missing presentation data:', { 
        hasPresentation: !!presentation, 
        hasSlides: !!(presentation?.slides),
        slidesLength: presentation?.slides?.length || 0
      });
      return NextResponse.json(
        { error: 'Presentation data with slides is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting PowerPoint generation...');
    console.log('📊 Slides to generate:', presentation.slides.length);
    console.log('📝 Presentation title:', presentation.title);
    
    // Create new PowerPoint presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Snap2Slides';
    pptx.company = 'Snap2Slides AI';
    pptx.title = presentation.title || 'AI Generated Presentation';
    pptx.subject = 'Generated from image analysis';
    
    // Add slides
    presentation.slides.forEach((slide: any, index: number) => {
      console.log(`🖼️ Adding slide ${index + 1}: ${slide.title}`);
      console.log(`📋 Slide contents count: ${slide.contents?.length || 0}`);
      
      const pptxSlide = pptx.addSlide();
      
      // Set slide background
      pptxSlide.background = { fill: slide.theme?.colors?.background || '#FFFFFF' };
      
      // Process each content element
      if (slide.contents && Array.isArray(slide.contents)) {
        slide.contents.forEach((content: any) => {
          console.log(`  📝 Adding content: ${content.type} - "${content.content?.substring(0, 50)}..."`);
          
          switch (content.type) {
            case 'title':
              pptxSlide.addText(content.content, {
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 1.5,
                fontSize: 28,
                fontFace: 'Arial',
                bold: true,
                align: 'center',
                color: slide.theme?.colors?.primary || '#000000'
              });
              break;
              
            case 'text':
              pptxSlide.addText(content.content, {
                x: 0.5,
                y: 2.5,
                w: 9,
                h: 2,
                fontSize: 16,
                fontFace: 'Arial',
                align: 'left',
                color: slide.theme?.colors?.text || '#000000'
              });
              break;
              
            case 'bullet':
              // For bullets, we'll collect them and add as a bullet list
              break;
          }
        });
        
        // Add bullet points as individual text elements
        const bullets = slide.contents.filter((content: any) => content.type === 'bullet');
          
        if (bullets.length > 0) {
          console.log(`  📋 Adding ${bullets.length} bullet points`);
          
          // Add each bullet point as a separate text element
          bullets.forEach((bullet: any, bulletIndex: number) => {
            pptxSlide.addText(`• ${bullet.content}`, {
              x: 0.5,
              y: 4 + (bulletIndex * 0.5),
              w: 9,
              h: 0.4,
              fontSize: 14,
              fontFace: 'Arial',
              align: 'left',
              color: slide.theme?.colors?.text || '#000000'
            });
          });
        }
      } else {
        console.log(`  ⚠️ No contents found for slide ${index + 1}`);
      }
    });

    console.log('✅ PowerPoint slides generated successfully');

    // Generate the PPTX file as uint8array for better compatibility
    console.log('📦 Converting to file format...');
    const pptxData = await pptx.write({ outputType: 'uint8array' }) as Uint8Array;
    console.log('📊 Generated file size:', pptxData.length, 'bytes');
    
    // Convert to Buffer for response
    const buffer = Buffer.from(pptxData);
    console.log('✅ File ready for download');
    
    // Return the file data for download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${presentation.title || 'presentation'}.pptx"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ PPTX generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PowerPoint presentation',
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
