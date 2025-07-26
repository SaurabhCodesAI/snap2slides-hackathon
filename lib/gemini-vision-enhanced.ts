// Enhanced AI vision analysis for Snap2Slides
// This is where the magic happens - we use Google's Gemini AI to understand images
// and transform them into beautiful presentation slides

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiAnalysisResult, SlideTheme } from '@/types/slides';

// Make sure we have the API key - this is critical for everything to work
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

// Initialize the AI client - this connects us to Google's AI models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple delay function - sometimes we need to wait before trying again
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Smart retry system - if the API is busy, we'll wait and try again
// This prevents those annoying "rate limit exceeded" errors
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      // Check if this is a rate limiting error - these are common with AI APIs
      const isRateLimit = error?.message?.includes('rate limit') || 
                         error?.message?.includes('quota') ||
                         error?.status === 429;
      
      if (isRateLimit && attempt < maxRetries) {
        // Wait longer each time (1s, 2s, 4s) - this gives the API time to recover
        const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
        console.log(`🔄 API is busy. Waiting ${delayMs}ms before retry ${attempt}/${maxRetries}`);
        await sleep(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// Main function - this analyzes an uploaded image and extracts meaningful content
// It's like having a really smart human look at your image and describe everything
export async function analyzeImageWithGeminiPro(
  imageBuffer: Buffer,
  mimeType: string,
  userPrompt?: string
): Promise<GeminiAnalysisResult> {
  return retryWithBackoff(async () => {
    // Use the most powerful AI model available - we want the best quality analysis
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.3, // Keep responses focused and consistent
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 6144 // Reasonable limit to avoid API issues
      }
    });

    // This is our detailed instruction set for the AI
    // We're basically telling it "be an expert presentation designer"
    const enhancedSystemPrompt = `
You're a world-class presentation designer. Look at this image and help create amazing slides.

What I need you to do:
- Find the key information and organize it logically
- Make titles that grab attention but stay professional  
- Write bullet points that people actually care about
- Suggest colors that look great together
- Pick a theme that fits the content

Just give me clean JSON in this format:
{
  "structuredContent": {
    "title": "Clear, compelling title that makes sense",
    "sections": [
      {
        "heading": "Section heading that tells a story",
        "bullets": ["Specific points that matter to the audience", "Real benefits, not fluff"],
        "images": ["Describe what images would help tell this story"]
      }
    ]
  },
  "suggestedTheme": "modern|classic|minimal|creative",
  "colorPalette": ["#primary", "#secondary", "#accent", "#background", "#text"],
  "confidence": 0.95
}

Keep it simple but smart. Make sure everything flows naturally.

${userPrompt ? `\nExtra context from user: ${userPrompt}\n\nUse this to make the slides even better.` : ''}

Important: Make sure the JSON is perfect - no extra commas or broken quotes.
`;

    // Prepare the image for the AI to analyze
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    };

    // Send the image and our instructions to the AI
    const result = await model.generateContent([enhancedSystemPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 AI finished analyzing the image');

    // Extract the JSON response - sometimes AI wraps it in markdown code blocks
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find JSON wrapped in code blocks
      jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1]; // Use the captured group
      }
    }
    
    if (!jsonMatch) {
      console.error('Could not find JSON in AI response:', text);
      throw new Error('AI response was not in the expected format');
    }

    // Parse the JSON response and validate it
    let analysisResult: GeminiAnalysisResult;
    try {
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Raw response:', jsonMatch[0]);
      throw new Error('AI response contained invalid JSON');
    }
    
    // Make sure we got all the required fields
    const validationErrors: string[] = [];
    
    if (!analysisResult.structuredContent) {
      validationErrors.push('Missing structuredContent');
    } else {
      if (!analysisResult.structuredContent.title) validationErrors.push('Missing title');
      if (!Array.isArray(analysisResult.structuredContent.sections)) validationErrors.push('Invalid sections array');
    }
    
    if (!analysisResult.suggestedTheme) validationErrors.push('Missing suggestedTheme');
    if (!Array.isArray(analysisResult.colorPalette)) validationErrors.push('Missing colorPalette');
    
    if (validationErrors.length > 0) {
      console.error('Response validation failed:', validationErrors);
      throw new Error(`AI response missing required fields: ${validationErrors.join(', ')}`);
    }

    console.log('✅ Image analysis completed successfully');
    return analysisResult;
  }, 3, 2000); // Try up to 3 times with 2-second delays if needed
}

// Function to make slide content more engaging and professional
export async function enhanceSlideContentPro(
  slideContent: string,
  theme: string,
  targetAudience?: string
): Promise<string> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.4, // Allow some creativity but keep it professional
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1536 // Keep responses concise
      }
    });

    // Simple, clear instructions for content improvement
    const enhancedPrompt = `
You're a presentation expert. Take this slide content and make it better.

Original content: "${slideContent}"
Theme: ${theme}
${targetAudience ? `Audience: ${targetAudience}` : ''}

What to do:
- Make the language more engaging and clear
- Remove unnecessary words and fluff
- Add specific details that matter
- Make sure it flows well when spoken
- Keep it professional but not boring

Just give me the improved text - no explanations needed.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const enhancedText = response.text().trim();
    
    console.log('✨ Content enhanced with professional polish');
    return enhancedText;
  }, 2, 1500); // Try twice if needed
}

// Function to create smart color themes based on content
export async function generateSmartTheme(
  contentAnalysis: string,
  brandColors?: string[],
  industry?: string
): Promise<SlideTheme> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.6,
        topK: 50,
        topP: 0.9,
        maxOutputTokens: 1024
      }
    });

    const themePrompt = `
You're a design expert. Create a great-looking theme for this presentation.

Content summary: ${contentAnalysis}
${brandColors ? `Brand colors to consider: ${brandColors.join(', ')}` : ''}
${industry ? `Industry: ${industry}` : ''}

I need a theme that:
- Looks professional and modern
- Has good contrast for readability
- Matches the content's tone
- Works well in business settings

Give me JSON only:
{
  "id": "smart-custom-theme",
  "name": "AI-Generated Smart Theme",
  "colors": {
    "primary": "#hex-color",
    "secondary": "#hex-color", 
    "accent": "#hex-color",
    "background": "#hex-color",
    "text": "#hex-color"
  },
  "fonts": {
    "heading": "font-family",
    "body": "font-family"
  },
  "layout": "modern"
}

Keep it clean and professional.
`;

    try {
      const result = await model.generateContent(themePrompt);
      const response = await result.response;
      const text = response.text().trim();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in theme response');
      }

      const smartTheme = JSON.parse(jsonMatch[0]) as SlideTheme;
      console.log('🎨 Smart theme created successfully');
      return smartTheme;
    } catch (error) {
      console.error('Theme generation failed:', error);
      // Return a safe default theme
      return {
        id: 'fallback-smart',
        name: 'Smart Professional',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b', 
          accent: '#06b6d4',
          background: '#ffffff',
          text: '#1e293b'
        },
        fonts: {
          heading: 'Inter, sans-serif',
          body: 'Inter, sans-serif'
        },
        layout: 'modern'
      };
    }
  }, 2, 1000);
}

// Function to optimize the order of slides for better storytelling
export async function optimizeSlideFlow(
  slides: any[],
  presentationType: 'pitch' | 'training' | 'report' | 'sales' = 'pitch'
): Promise<string[]> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.3, // Keep suggestions logical and consistent
        topK: 30,
        topP: 0.9,
        maxOutputTokens: 1024 // Keep responses focused
      }
    });

    const optimizationPrompt = `
You're a presentation expert. Help me organize these slides in the best order.

Current slides: ${JSON.stringify(slides.map(s => ({ title: s.title, elements: s.contents?.length || 0 })))}
Presentation type: ${presentationType}

Consider what works best for ${presentationType} presentations:
${presentationType === 'pitch' ? '- Start strong, build credibility, show the problem, present solution, prove value, call to action' : ''}
${presentationType === 'training' ? '- Set objectives, start simple, build complexity, include practice, wrap up' : ''}
${presentationType === 'report' ? '- Executive summary first, show how you got data, present findings, what it means, what to do' : ''}
${presentationType === 'sales' ? '- Identify pain points, show solution, provide proof, handle objections, close the deal' : ''}

Just give me a JSON array of slide titles in the best order:
["slide title 1", "slide title 2", "slide title 3"]
`;

    const result = await model.generateContent(optimizationPrompt);
    const response = await result.response;
    const text = response.text();

    // Find the JSON array in the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Return original order if optimization fails
      console.log('Could not parse flow optimization, using original order');
      return slides.map(s => s.title);
    }

    try {
      const optimizedOrder = JSON.parse(jsonMatch[0]) as string[];
      console.log('🔄 Slide flow optimized for better storytelling');
      return optimizedOrder;
    } catch (error) {
      console.error('Error parsing optimized order:', error);
      return slides.map(s => s.title); // Return original order as fallback
    }
  }, 2, 1000);
}

// Function to generate helpful speaker notes for each slide
export async function generateSpeakerNotes(
  slideContent: any,
  presentationType: string = 'general'
): Promise<string> {
  try {
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-latest',
        generationConfig: {
          temperature: 0.4, // Allow some personality in the notes
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1024 // Keep notes concise but helpful
        }
      });

      const notesPrompt = `
You're a presentation coach. Help me create speaker notes for this slide.

Slide content: ${JSON.stringify(slideContent)}
Presentation type: ${presentationType}

I need notes that help me:
- Know what to say and how to say it
- Keep good timing and pace
- Connect with the audience  
- Transition smoothly to the next slide
- Handle questions that might come up

Give me practical speaking notes in this format:
- Opening (how to start this slide)
- Main points (what to emphasize)
- Timing tips (where to pause, slow down)
- Transition (how to move to next slide)
- Q&A prep (likely questions)

Keep it conversational and natural - like a coach talking to me.
`;

      const result = await model.generateContent(notesPrompt);
      const response = await result.response;
      const speakerNotes = response.text().trim();
      
      console.log('🎤 Speaker notes created to help with presentation delivery');
      return speakerNotes;
    }, 2, 1500); // 2 retries with 1.5s base delay
    
    return result;
  } catch (error) {
    console.error('Speaker notes generation failed after retries:', error);
    console.log('🎤 Using fallback speaker notes due to retry exhaustion');
    return 'Key points: Review slide content, engage with audience, transition smoothly to next topic.';
  }
}
