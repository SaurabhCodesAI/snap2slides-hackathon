// Simple unit tests for API logic without Next.js dependencies
import { validateFile, sanitizeInput } from '@/lib/utils';

describe('API Helper Functions', () => {
  describe('validateFile', () => {
    it('accepts valid image files', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
    });

    it('rejects non-image files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('rejects oversized files', () => {
      const largeContent = 'x'.repeat(15 * 1024 * 1024); // 15MB
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size too large');
    });
  });

  describe('sanitizeInput', () => {
    it('sanitizes user input properly', () => {
      const input = '<script>alert("xss")</script>Create a presentation';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Create a presentation');
    });

    it('limits input length', () => {
      const longInput = 'a'.repeat(2000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });
});
