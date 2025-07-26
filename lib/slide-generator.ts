// Slide generator - transforms AI analysis into actual presentation slides
// This takes the smart analysis from our AI and creates beautiful, structured slides

import type { Slide, SlideContent, SlideTheme, SlidePresentation, GeminiAnalysisResult } from '@/types/slides';
import { nanoid } from 'nanoid';

// Predefined themes that look great and work in any business setting
// These are carefully designed with good contrast and professional appeal
export const DEFAULT_THEMES: SlideTheme[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    colors: {
      primary: '#2563eb',    // Clean blue
      secondary: '#64748b',  // Subtle gray
      accent: '#06b6d4',     // Bright cyan
      background: '#ffffff', // Pure white
      text: '#1e293b'        // Dark gray for readability
    },
    fonts: {
      heading: 'Inter, sans-serif', // Clean, modern font
      body: 'Inter, sans-serif'
    },
    layout: 'modern'
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    colors: {
      primary: '#000000',    // Pure black
      secondary: '#6b7280',  // Medium gray
      accent: '#f59e0b',     // Warm amber
      background: '#f9fafb', // Off-white
      text: '#111827'        // Almost black
    },
    fonts: {
      heading: 'SF Pro Display, sans-serif', // Apple's font - clean and elegant
      body: 'SF Pro Text, sans-serif'
    },
    layout: 'minimal'
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    colors: {
      primary: '#7c3aed',    // Rich purple
      secondary: '#ec4899',  // Bright pink
      accent: '#f97316',     // Orange pop
      background: '#1e1b4b', // Dark navy
      text: '#f8fafc'        // Light text for contrast
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif', // Modern geometric font
      body: 'Inter, sans-serif'
    },
    layout: 'creative'
  },
  {
    id: 'classic',
    name: 'Business Classic',
    colors: {
      primary: '#1f2937',
      secondary: '#4b5563',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#374151'
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, sans-serif'
    },
    layout: 'classic'
  }
];

export function generateThemeFromColors(colorPalette: string[]): SlideTheme {
  const [primary, secondary, accent, background = '#ffffff', text = '#1e293b'] = colorPalette;
  
  return {
    id: `custom-${nanoid(8)}`,
    name: 'AI Generated Theme',
    colors: {
      primary: primary || '#2563eb',
      secondary: secondary || '#64748b',
      accent: accent || '#06b6d4',
      background,
      text
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    layout: 'modern'
  };
}

export function createSlideFromContent(
  content: { heading: string; bullets: string[]; images?: string[] },
  theme: SlideTheme,
  index: number
): Slide {
  const slideContents: SlideContent[] = [];

  // Add title
  slideContents.push({
    id: nanoid(),
    type: 'title',
    content: content.heading,
    position: { x: 50, y: 20 },
    style: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: theme.colors.primary,
      alignment: 'center'
    }
  });

  // Add bullet points
  content.bullets.forEach((bullet, bulletIndex) => {
    slideContents.push({
      id: nanoid(),
      type: 'bullet',
      content: bullet,
      position: { x: 20, y: 40 + (bulletIndex * 12) },
      style: {
        fontSize: '1.25rem',
        color: theme.colors.text,
        alignment: 'left'
      }
    });
  });

  // Add images if any
  if (content.images && content.images.length > 0) {
    content.images.forEach((image, imageIndex) => {
      slideContents.push({
        id: nanoid(),
        type: 'image',
        content: image,
        position: { x: 70, y: 30 + (imageIndex * 20) },
        size: { width: 25, height: 20 }
      });
    });
  }

  return {
    id: nanoid(),
    title: content.heading,
    contents: slideContents,
    theme,
    transition: 'fade',
    background: {
      type: 'color',
      value: theme.colors.background
    }
  };
}

export function generatePresentationFromAnalysis(
  analysis: GeminiAnalysisResult,
  customTheme?: SlideTheme
): SlidePresentation {
  // Select or generate theme with proper fallback
  const fallbackTheme = DEFAULT_THEMES[0]!; // Non-null assertion since we know it exists
  let selectedTheme: SlideTheme;
  
  if (customTheme) {
    selectedTheme = customTheme;
  } else if (analysis.colorPalette.length >= 3) {
    selectedTheme = generateThemeFromColors(analysis.colorPalette);
  } else {
    selectedTheme = DEFAULT_THEMES.find(t => t.id === analysis.suggestedTheme) || fallbackTheme;
  }

  // Create title slide
  const titleSlide: Slide = {
    id: nanoid(),
    title: analysis.structuredContent.title,
    contents: [
      {
        id: nanoid(),
        type: 'title',
        content: analysis.structuredContent.title,
        position: { x: 50, y: 50 },
        style: {
          fontSize: '3rem',
          fontWeight: 'bold',
          color: selectedTheme.colors.primary,
          alignment: 'center'
        }
      }
    ],
    theme: selectedTheme,
    transition: 'fade',
    background: {
      type: 'gradient',
      value: `linear-gradient(135deg, ${selectedTheme.colors.background} 0%, ${selectedTheme.colors.primary}10 100%)`
    }
  };

  // Create content slides
  const contentSlides = analysis.structuredContent.sections.map((section, index) =>
    createSlideFromContent(section, selectedTheme, index + 1)
  );

  return {
    id: nanoid(),
    title: analysis.structuredContent.title,
    slides: [titleSlide, ...contentSlides],
    theme: selectedTheme,
    metadata: {
      created: new Date(),
      updated: new Date(),
      description: `AI-generated presentation from uploaded content`
    },
    settings: {
      autoAdvance: false,
      showControls: true
    }
  };
}

export function optimizeSlideLayout(slide: Slide): Slide {
  // Auto-arrange content based on type and priority
  const optimizedContents = [...slide.contents];
  
  // Sort by type priority (title > subtitle > bullet > text > image > code > chart)
  const typePriority: Record<string, number> = { 
    title: 1, 
    subtitle: 2, 
    bullet: 3, 
    text: 4, 
    image: 5, 
    code: 6, 
    chart: 7 
  };
  optimizedContents.sort((a, b) => (typePriority[a.type] || 10) - (typePriority[b.type] || 10));

  // Reposition elements for better layout
  let currentY = 15;
  const repositionedContents = optimizedContents.map((content, index) => {
    let newPosition = { ...content.position };
    
    switch (content.type) {
      case 'title':
        newPosition = { x: 50, y: currentY };
        currentY += 20;
        break;
      case 'subtitle':
        newPosition = { x: 50, y: currentY };
        currentY += 15;
        break;
      case 'bullet':
        newPosition = { x: 15, y: currentY };
        currentY += 12;
        break;
      case 'text':
        newPosition = { x: 15, y: currentY };
        currentY += 15;
        break;
      case 'image':
        newPosition = { x: 70, y: 25 };
        break;
      default:
        // Keep original position for unknown types
        break;
    }
    
    return {
      ...content,
      position: newPosition
    };
  });

  return {
    ...slide,
    contents: repositionedContents
  };
}
