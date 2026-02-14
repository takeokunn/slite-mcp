import { IndexCustomContentParamsSchema } from '@src/schemas/ask';
import { indexCustomContentDefinition } from '@src/tools/ask/index-custom-content';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('indexCustomContent tool', () => {
  const fullInput = {
    rootId: 'root-1',
    id: 'obj-1',
    title: 'Test Document',
    content: '# Hello World',
    type: 'markdown' as const,
    updatedAt: '2025-01-01T00:00:00Z',
    url: 'https://example.com/doc',
  };

  it('should return formatted MCP response after indexing', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await indexCustomContentDefinition.handler(mockClient, fullInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      id: 'obj-1',
      title: 'Test Document',
      content: '# Hello World',
      type: 'markdown',
      updatedAt: '2025-01-01T00:00:00Z',
      url: 'https://example.com/doc',
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle html content type', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const htmlInput = {
      ...fullInput,
      content: '<h1>Hello</h1>',
      type: 'html' as const,
    };

    const result = await indexCustomContentDefinition.handler(mockClient, htmlInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/ask/index',
      expect.objectContaining({
        content: '<h1>Hello</h1>',
        type: 'html',
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Indexing failed');

    await expect(indexCustomContentDefinition.handler(mockClient, fullInput)).rejects.toThrow(
      'Indexing failed',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(indexCustomContentDefinition.handler(mockClient, fullInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(indexCustomContentDefinition.name).toBe('index_custom_content');
    expect(indexCustomContentDefinition.description).toBeDefined();
    expect(indexCustomContentDefinition.inputSchema).toEqual(IndexCustomContentParamsSchema);
  });
});
