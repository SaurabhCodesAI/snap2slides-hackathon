import { NextRequest, NextResponse } from 'next/server';
import formidable, { File as FormidableFile } from 'formidable';
import { Readable } from 'stream';
import { nanoid } from 'nanoid';

// Modern Next.js 14 configuration
export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic'; // Prevent static generation

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

async function parseForm(req: NextRequest): Promise<{ fields: any; files: { image: FormidableFile } }> {
  const buffers: Buffer[] = [];
  for await (const chunk of req.body as any as Readable) {
    buffers.push(chunk);
  }
  const buffer = Buffer.concat(buffers);
  // Convert NextRequest headers to plain object
  const headersObj: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  // Create a minimal IncomingMessage mock for formidable
  const { IncomingMessage } = require('http');
  class MockReq extends IncomingMessage {
    headers: Record<string, string>;
    method: string;
    url: string;
    
    constructor(buffer: Buffer, headers: Record<string, string>) {
      super(null as any);
      this.headers = headers;
      this.method = 'POST';
      this.url = '/api/upload-image';
      
      // Add required properties
      this.complete = false;
      this.headersDistinct = {};
      this.rawHeaders = [];
      this.trailers = {};
      this.rawTrailers = [];
      this.aborted = false;
      this.httpVersion = '1.1';
      this.httpVersionMajor = 1;
      this.httpVersionMinor = 1;
      
      // Push the buffer data
      setTimeout(() => {
        this.push(buffer);
        this.push(null);
        this.complete = true;
      }, 0);
    }
  }
  const mockReq = new MockReq(buffer, headersObj);
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: MAX_SIZE });
    form.parse(mockReq as any, (err, fields, files) => {
      if (err) return reject(err);
      // Extract image file
      const image = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!image) {
        return reject(new Error('No image file found'));
      }
      resolve({ fields, files: { image } });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Runtime validation for required environment variables
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Cloud Storage not configured' 
      }, { status: 500 });
    }

    // Dynamic import to avoid build-time issues
    const { bucket } = await import('@/lib/gcs');

    const { files } = await parseForm(req);
    const file = files.image;
    if (!file) throw new Error('No image uploaded');
    if (!file.mimetype || !ALLOWED_TYPES.includes(file.mimetype)) throw new Error('Invalid file type');
    if (file.size > MAX_SIZE) throw new Error('File too large');

    const originalFilename = file.originalFilename || 'upload';
    const ext = originalFilename.split('.').pop() || 'jpg';
    const filename = `uploads/${Date.now()}-${nanoid()}.${ext}`;
    const blob = bucket.file(filename);
    await blob.save(file.filepath);
    await blob.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
