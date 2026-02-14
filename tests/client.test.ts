import { createSliteClient } from '@src/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('createSliteClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should throw error when SLITE_API_TOKEN is missing', () => {
      delete process.env.SLITE_API_TOKEN;

      expect(() => createSliteClient()).toThrow('SLITE_API_TOKEN is required');
    });

    it('should create client with environment variables', () => {
      process.env.SLITE_API_TOKEN = 'test-token';

      const client = createSliteClient();
      expect(client).toBeDefined();
      expect(client.get).toBeTypeOf('function');
      expect(client.post).toBeTypeOf('function');
      expect(client.put).toBeTypeOf('function');
      expect(client.delete).toBeTypeOf('function');
    });

    it('should create client with explicit config', () => {
      const client = createSliteClient({ apiToken: 'config-token' });
      expect(client).toBeDefined();
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      const result = await client.get('/test');

      expect(result).toEqual({ result: 'success' });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('should make GET request with query params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await client.get('/test', { page: 1, query: 'hello' });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test?page=1&query=hello',
        expect.any(Object),
      );
    });

    it('should skip undefined query params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await client.get('/test', { page: 1, query: undefined });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test?page=1',
        expect.any(Object),
      );
    });

    it('should make POST request with body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '123' }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      const result = await client.post('/test', { name: 'test' });

      expect(result).toEqual({ id: '123' });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        }),
      );
    });

    it('should make POST request with query params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ answer: 'response' }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await client.post('/ask', undefined, { question: 'What is this?' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('question=What+is+this'),
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should make PUT request with body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ updated: true }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      const result = await client.put('/test/123', { title: 'updated' });

      expect(result).toEqual({ updated: true });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ title: 'updated' }),
        }),
      );
    });

    it('should handle 204 No Content response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      const result = await client.delete('/test/123');

      expect(result).toEqual({});
    });

    it('should make DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ deleted: true }),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      const result = await client.delete('/test/123');

      expect(result).toEqual({ deleted: true });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.slite.com/v1/test/123',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await expect(client.get('/nonexistent')).rejects.toThrow('Slite API error (404)');
    });

    it.each([
      [401, 'Unauthorized'],
      [403, 'Forbidden'],
      [500, 'Internal Server Error'],
    ])('should handle %i status code', async (status, text) => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status,
        text: () => Promise.resolve(text),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await expect(client.get('/test')).rejects.toThrow(`Slite API error (${status}): ${text}`);
    });

    it('should truncate long error messages', async () => {
      const longError = 'A'.repeat(300);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(longError),
      });

      const client = createSliteClient({ apiToken: 'test-token' });

      await expect(client.get('/test')).rejects.toThrow(
        `Slite API error (500): ${'A'.repeat(200)}...`,
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const client = createSliteClient({ apiToken: 'test-token' });

      await expect(client.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle timeout', async () => {
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(
              () => reject(new DOMException('The operation was aborted', 'AbortError')),
              100,
            );
          }),
      );

      const client = createSliteClient({ apiToken: 'test-token' });

      await expect(client.get('/test')).rejects.toThrow();
    });
  });
});
