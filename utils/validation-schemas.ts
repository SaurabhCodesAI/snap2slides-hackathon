// utils/validation-schemas.ts
// Defines input validation schemas using Zod for robust API data validation.

import { z } from 'zod'; // Import Zod.

// Schema for the image upload API.
// This schema is for *accompanying metadata* with an image upload.
// Actual file content (binary data, MIME type, size) is typically validated
// at the API route handler level using a multipart parser (e.g., multer, formidable).
export const ImageUploadSchema = z.object({
  // Example: If you expect an image ID or description with the upload:
  // imageId: z.string().uuid("Invalid image ID format.").optional(),
  // description: z.string().max(500, "Description too long.").optional(),
});

// Schema for the Gemini API route's payload.
// Represents the expected data for AI processing.
// Note: 'File' is a browser API that's also available in Node.js FormData.
export const GeminiInputSchema = z.object({
  // For browser File objects from FormData
  file: z.instanceof(File, {
    message: 'File data is missing or malformed for Gemini processing.',
  }).refine(
    (file) => file.type.startsWith('image/'),
    { message: 'File must be an image type.' }
  ).refine(
    (file) => file.size > 0,
    { message: 'File size must be positive.' }
  ),
  prompt: z.string().max(1000, 'Prompt must be 1000 characters or less.').optional(), // Optional prompt text, with max length.
  theme: z.enum(['minimalist', 'dark', 'colorful'], { // Theme must be one of these specific predefined values.
    errorMap: (issue, ctx) => ({ message: 'Invalid theme selected.' }), // Custom error message.
  }),
});

// Schema for PPTX generation API route's payload.
// Validates the structured content from Gemini and the selected theme.
export const PptxGenerationSchema = z.object({
  data: z.object({ // Expects the structured content (overallSummary, slideContent).
    overallSummary: z.string().min(1, 'Summary cannot be empty.').max(500, 'Summary too long.'),
    slideContent: z.array(z.object({
      title: z.string().min(1, 'Slide title cannot be empty.').max(100, 'Slide title too long.'),
      bulletPoints: z.array(z.string().min(1, 'Bullet point cannot be empty.').max(200, 'Bullet point too long.')).min(1, 'At least one bullet point required.').max(10, 'Too many bullet points per slide.'),
    })).min(1, 'At least one slide is required.').max(15, 'Too many slides generated.'), // Max 15 slides to prevent overly large PPTX files.
  }),
  selectedTheme: z.enum(['minimalist', 'dark', 'colorful'], {
    errorMap: (issue, ctx) => ({ message: 'Invalid theme selected for PPTX generation.' }),
  }),
});

// Schema for saving history records to MongoDB.
// Validates the data before insertion into the database.
export const HistorySaveSchema = z.object({
  inputImageUrl: z.string().url('Input image URL must be a valid URL.').optional().nullable(), // Permanent URL of the original image from GCS.
  generatedSlidesUrl: z.string().url('Generated slides URL must be valid.').optional().nullable(), // URL of the generated PPTX (Blob URL) or interactive presentation link.
  summary: z.string().min(1, 'Summary is required.').max(500, 'Summary too long.'),
  themeUsed: z.enum(['minimalist', 'dark', 'colorful'], {
    errorMap: (issue, ctx) => ({ message: 'Invalid theme used for history.' }),
  }),
  // Refined from z.array(z.any()) to z.array(z.unknown()) for better type safety.
  // If the structure of slideContentDetails is known, define a more specific schema.
  slideContentDetails: z.array(z.unknown()).optional().nullable(), // Full structured content, primarily for interactive viewer.
  outputType: z.enum(['pptx', 'interactive'], {
    errorMap: (issue, ctx) => ({ message: 'Invalid output type for history.' }),
  }),
  userId: z.string().optional().nullable(), // Auth0 user ID for personalized history.
});