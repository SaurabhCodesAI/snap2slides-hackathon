// Google Cloud Storage integration for handling uploaded images
// This keeps our images safe and accessible when needed

import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage with our credentials
// Using environment variables to keep everything secure
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'default-project',
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || './google-credentials.json',
});

// Our storage bucket for uploaded images
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'snap2slides-uploads';

/**
 * Get a reference to our storage bucket
 * This is where all the uploaded images live
 */
export const bucket = storage.bucket(bucketName);

/**
 * Upload a file to Google Cloud Storage
 * Returns the public URL where the file can be accessed
 */
export async function uploadFile(
  file: Buffer, 
  fileName: string, 
  contentType: string
): Promise<string> {
  try {
    // Create a unique filename to avoid conflicts
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    
    // Upload the file to our bucket
    const fileUpload = bucket.file(uniqueFileName);
    
    await fileUpload.save(file, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000', // Cache for a year
      },
    });
    
    // Make the file publicly readable
    await fileUpload.makePublic();
    
    // Return the public URL
    return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
}

/**
 * Delete a file from Google Cloud Storage
 * Cleanup when files are no longer needed
 */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    await bucket.file(fileName).delete();
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    // Don't throw error for delete operations - it's not critical
  }
}

/**
 * Check if Google Cloud Storage is properly configured
 * Useful for health checks and debugging
 */
export async function isConfigured(): Promise<boolean> {
  try {
    await bucket.getMetadata();
    return true;
  } catch (error) {
    console.error('GCS configuration error:', error);
    return false;
  }
}
