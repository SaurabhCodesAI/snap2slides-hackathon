// Type definitions for Snap2Slides
// These define the shape of our data - what properties things have and what types they are

// What we get back from the AI when it analyzes an image
export interface GeminiAnalysisResult {
  structuredContent: {
    title: string;           // Main title for the presentation
    sections: {              // Different sections/slides
      heading: string;       // Section heading
      bullets: string[];     // List of bullet points
      images?: string[];     // Optional image descriptions
    }[];
  };
  suggestedTheme: string;    // Theme recommendation from AI
  colorPalette: string[];    // Suggested colors as hex codes
  confidence: number;        // How confident the AI is (0-1)
}

// Visual theme for presentations - colors, fonts, layout style
export interface SlideTheme {
  id: string;                // Unique theme identifier
  name: string;              // Human-readable theme name
  colors: {
    primary: string;         // Main brand color
    secondary: string;       // Supporting color
    accent: string;          // Highlight color
    background: string;      // Background color
    text: string;            // Text color
  };
  fonts: {
    heading: string;         // Font for titles and headings
    body: string;           // Font for body text
  };
  layout: 'classic' | 'modern' | 'minimal' | 'creative'; // Overall style
}

// Individual content element on a slide (text, image, etc.)
export interface SlideContent {
  id: string;                           // Unique content ID
  type: 'title' | 'subtitle' | 'bullet' | 'image' | 'text'; // What kind of content this is
  content: string;                      // The actual text or image URL
  position: { x: number; y: number };   // Where to place it on the slide
  size?: { width: number; height: number }; // Optional size constraints
  style?: {                             // Optional styling
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

// A single slide in the presentation
export interface Slide {
  id: string;               // Unique slide ID
  title: string;            // Slide title
  contents: SlideContent[];
  theme: SlideTheme;
  transition?: 'fade' | 'slide' | 'zoom';
  background?: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  speakerNotes?: string;
}

export interface SlidePresentation {
  id: string;
  title: string;
  slides: Slide[];
  theme: SlideTheme;
  metadata: {
    created: Date;
    updated: Date;
    author?: string;
    description?: string;
  };
  settings: {
    autoAdvance?: boolean;
    timing?: number;
    showControls?: boolean;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'html' | 'pptx';
  quality: 'low' | 'medium' | 'high';
  includeNotes?: boolean;
  customTheme?: SlideTheme;
}

export interface PresentationSession {
  id: string;
  title: string;
  slides: Slide[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalSlides: number;
    estimatedDuration: number;
    theme: string;
    originalImageName?: string;
  };
}

export interface AnalysisProgress {
  stage: 'uploading' | 'analyzing' | 'generating' | 'optimizing' | 'complete';
  progress: number;
  message: string;
  error?: string;
}

export interface PresentationConfig {
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  theme?: SlideTheme;
  showProgress?: boolean;
  enableKeyboardShortcuts?: boolean;
  fullscreenMode?: boolean;
}
