import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock formidable
const mockParse = jest.fn();
jest.mock('formidable', () => {
  return jest.fn(() => ({
    parse: mockParse
  }));
});

// Mock Google Cloud Storage
const mockSave = jest.fn();
const mockMakePublic = jest.fn();
const mockFile = jest.fn(() => ({
  save: mockSave,
  makePublic: mockMakePublic
}));

jest.mock('@/lib/gcs', () => ({
  bucket: {
    file: mockFile,
    name: 'test-bucket'
  }
}));

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}));

describe('/api/upload-image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mocks to default successful behavior
    mockParse.mockImplementation((req, callback) => {
      const mockFile = {
        filepath: '/tmp/test-file.jpg',
        originalFilename: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };
      callback(null, {}, { image: mockFile });
    });
    
    mockSave.mockResolvedValue(undefined);
    mockMakePublic.mockResolvedValue(undefined);
  });

  it('successfully uploads a valid image', async () => {
    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.url).toContain('https://storage.googleapis.com/test-bucket/');
    expect(result.url).toContain('test-id-123');
  });

  it('rejects request with no image file', async () => {
    // Mock formidable to return no file
    mockParse.mockImplementation((req, callback) => {
      callback(null, {}, {});
    });

    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('No image uploaded');
  });

  it('rejects invalid file types', async () => {
    mockParse.mockImplementation((req, callback) => {
      const mockFile = {
        filepath: '/tmp/test-file.txt',
        originalFilename: 'test.txt',
        mimetype: 'text/plain',
        size: 1024
      };
      callback(null, {}, { image: mockFile });
    });

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'text/plain' }), 'test.txt');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid file type');
  });

  it('rejects files that are too large', async () => {
    mockParse.mockImplementation((req, callback) => {
      const mockFile = {
        filepath: '/tmp/test-file.jpg',
        originalFilename: 'large.jpg',
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024 // 10MB (over the 5MB limit)
      };
      callback(null, {}, { image: mockFile });
    });

    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('File too large');
  });

  it('handles file upload to cloud storage failure', async () => {
    mockSave.mockRejectedValue(new Error('Storage error'));

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Storage error');
  });

  it('handles make public failure', async () => {
    mockMakePublic.mockRejectedValue(new Error('Permission error'));

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Permission error');
  });

  it('accepts PNG files', async () => {
    mockParse.mockImplementation((req, callback) => {
      const mockFile = {
        filepath: '/tmp/test-file.png',
        originalFilename: 'test.png',
        mimetype: 'image/png',
        size: 1024
      };
      callback(null, {}, { image: mockFile });
    });

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/png' }), 'test.png');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('accepts WebP files', async () => {
    mockParse.mockImplementation((req, callback) => {
      const mockFile = {
        filepath: '/tmp/test-file.webp',
        originalFilename: 'test.webp',
        mimetype: 'image/webp',
        size: 1024
      };
      callback(null, {}, { image: mockFile });
    });

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/webp' }), 'test.webp');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('generates unique filenames', async () => {
    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(result.url).toMatch(/uploads\/\d+-test-id-123\.jpg/);
  });

  it('handles formidable parsing errors', async () => {
    mockParse.mockImplementation((req, callback) => {
      callback(new Error('Parse error'), null, null);
    });

    const formData = new FormData();
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

    const request = new NextRequest('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Parse error');
  });
});
