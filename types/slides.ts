// Type definitions for Snap2Slides
// These define the shape of our data - what properties things have and what types they are

// ===================
// API RESPONSE TYPES
// ===================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

/**
 * What we get back from the AI when it analyzes an image
 */
export interface GeminiAnalysisResult {
  structuredContent: {
    title: string;           // Main title for the presentation
    introduction?: string;   // Optional introduction text
    sections: {              // Different sections/slides
      heading: string;       // Section heading
      content?: string;      // Main content text
      bullets: string[];     // List of bullet points
      images?: string[];     // Optional image descriptions
    }[];
    conclusion?: string;     // Optional conclusion
  };
  suggestedTheme: string;    // Theme recommendation from AI
  colorPalette: string[];    // Suggested colors as hex codes
  confidence: number;        // How confident the AI is (0-1)
  processingTime?: number;   // Time taken for analysis in ms
}

// ===================
// PRESENTATION TYPES
// ===================

/**
 * Visual theme for presentations - colors, fonts, layout style
 */
export interface SlideTheme {
  readonly id: string;                // Unique theme identifier
  readonly name: string;              // Human-readable theme name
  readonly description?: string;      // Theme description
  readonly colors: {
    readonly primary: string;         // Main brand color
    readonly secondary: string;       // Supporting color
    readonly accent: string;          // Highlight color
    readonly background: string;      // Background color
    readonly text: string;            // Text color
    readonly surface?: string;        // Surface/card background
    readonly muted?: string;          // Muted text color
  };
  readonly fonts: {
    readonly heading: string;         // Font for titles and headings
    readonly body: string;           // Font for body text
    readonly code?: string;          // Font for code blocks
  };
  readonly layout: 'classic' | 'modern' | 'minimal' | 'creative'; // Overall style
  readonly spacing?: {
    readonly small: string;
    readonly medium: string;
    readonly large: string;
  };
}

/**
 * Individual content element on a slide (text, image, etc.)
 */
export interface SlideContent {
  readonly id: string;                           // Unique content ID
  readonly type: 'title' | 'subtitle' | 'bullet' | 'image' | 'text' | 'code' | 'chart'; // What kind of content this is
  readonly content: string;                      // The actual text or image URL
  readonly position: { readonly x: number; readonly y: number };   // Where to place it on the slide
  readonly size?: { readonly width: number; readonly height: number }; // Optional size constraints
  readonly style?: {                             // Optional styling
    readonly fontSize?: string;
    readonly fontWeight?: string;
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly alignment?: 'left' | 'center' | 'right' | 'justify';
    readonly padding?: string;
    readonly margin?: string;
    readonly borderRadius?: string;
    readonly animation?: SlideAnimation;
  };
  readonly metadata?: {                          // Additional metadata
    readonly order?: number;                     // Display order
    readonly duration?: number;                  // Animation duration
    readonly delay?: number;                     // Animation delay
  };
}

/**
 * Animation configuration for slide content
 */
export interface SlideAnimation {
  readonly type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
  readonly direction?: 'up' | 'down' | 'left' | 'right';
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Individual slide in a presentation
 */
export interface Slide {
  readonly id: string;                    // Unique slide identifier
  readonly title: string;                 // Slide title
  readonly contents: readonly SlideContent[];      // All content elements on this slide
  readonly theme: SlideTheme;             // Visual theme for this slide
  readonly layout?: 'title' | 'content' | 'two-column' | 'image-focus'; // Slide layout template
  readonly notes?: string;                // Speaker notes
  readonly metadata?: {
    readonly order: number;               // Position in presentation
    readonly duration?: number;           // How long to display (for auto-advance)
    readonly tags?: readonly string[];    // Categories or tags
    readonly created: Date;
    readonly updated: Date;
  };
  readonly transitions?: {
    readonly enter: SlideAnimation;
    readonly exit: SlideAnimation;
  };
  readonly transition?: 'fade' | 'slide' | 'zoom'; // Legacy compatibility
  readonly background?: {
    readonly type: 'color' | 'gradient' | 'image';
    readonly value: string;
  };
  readonly speakerNotes?: string; // Legacy compatibility
}

/**
 * Complete presentation containing multiple slides
 */
export interface SlidePresentation {
  readonly id: string;
  readonly title: string;
  readonly slides: readonly Slide[];
  readonly theme: SlideTheme;
  readonly metadata: {
    readonly created: Date;
    readonly updated: Date;
    readonly author?: string;
    readonly description?: string;
    readonly version?: string;
    readonly totalSlides?: number;
    readonly estimatedDuration?: number;
    readonly originalImageName?: string;
  };
  readonly settings: {
    readonly autoAdvance?: boolean;
    readonly timing?: number;
    readonly showControls?: boolean;
    readonly enableKeyboardShortcuts?: boolean;
    readonly fullscreenMode?: boolean;
    readonly showProgress?: boolean;
  };
}

// ===================
// EXPORT & SESSION TYPES
// ===================

/**
 * Export configuration options
 */
export interface ExportOptions {
  readonly format: 'pdf' | 'html' | 'pptx' | 'interactive';
  readonly quality: 'low' | 'medium' | 'high';
  readonly includeNotes?: boolean;
  readonly customTheme?: SlideTheme;
  readonly filename?: string;
  readonly compression?: boolean;
}

/**
 * Presentation session for tracking user progress
 */
export interface PresentationSession {
  readonly id: string;
  readonly title: string;
  readonly slides: readonly Slide[];
  readonly userId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly metadata?: {
    readonly totalSlides: number;
    readonly estimatedDuration: number;
    readonly theme: string;
    readonly originalImageName?: string;
    readonly fileSize?: number;
    readonly processingTime?: number;
  };
  readonly status: 'draft' | 'processing' | 'completed' | 'error';
}

/**
 * Analysis progress tracking
 */
export interface AnalysisProgress {
  readonly stage: 'uploading' | 'analyzing' | 'generating' | 'optimizing' | 'complete' | 'error';
  readonly progress: number; // 0-100
  readonly message: string;
  readonly error?: string;
  readonly startTime?: Date;
  readonly estimatedTimeRemaining?: number; // in seconds
  readonly details?: {
    readonly currentStep?: string;
    readonly totalSteps?: number;
    readonly completedSteps?: number;
  };
}

/**
 * Presentation configuration options
 */
export interface PresentationConfig {
  readonly autoAdvance?: boolean;
  readonly autoAdvanceDelay?: number; // in seconds
  readonly theme?: SlideTheme;
  readonly showProgress?: boolean;
  readonly enableKeyboardShortcuts?: boolean;
  readonly fullscreenMode?: boolean;
  readonly enableAnimations?: boolean;
  readonly controlsPosition?: 'bottom' | 'top' | 'side' | 'floating';
  readonly accessibility?: {
    readonly highContrast?: boolean;
    readonly reducedMotion?: boolean;
    readonly screenReaderOptimized?: boolean;
  };
}

// ===================
// UTILITY TYPES
// ===================

/**
 * File upload state
 */
export interface FileUploadState {
  readonly file: File | null;
  readonly preview?: string;
  readonly status: 'idle' | 'uploading' | 'success' | 'error';
  readonly progress: number;
  readonly error?: string;
}

/**
 * Theme variants for different presentation types
 */
export type ThemeVariant = 
  | 'business'
  | 'creative' 
  | 'academic'
  | 'minimal'
  | 'dark'
  | 'light'
  | 'colorful'
  | 'monochrome';

/**
 * Presentation format types
 */
export type PresentationFormat = 'interactive' | 'pptx' | 'pdf' | 'html';

/**
 * Content alignment options
 */
export type ContentAlignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Animation timing functions
 */
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

/**
 * Responsive breakpoints
 */
export interface ResponsiveBreakpoints {
  readonly xs: number;  // Mobile
  readonly sm: number;  // Small tablet
  readonly md: number;  // Tablet
  readonly lg: number;  // Desktop
  readonly xl: number;  // Large desktop
}
