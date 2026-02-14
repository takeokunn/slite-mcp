import { ListCustomContentParamsSchema } from '@src/schemas/ask';
import { listCustomContentDefinition } from '@src/tools/ask/list-custom-content';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listCustomContent tool', () => {
  it('should return formatted MCP response with content list', async () => {
    const mockResult = {
      hits: [{ id: 'obj-1' }, { id: 'obj-2' }],
      nbHits: 2,
      page: 0,
    };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listCustomContentDefinition.handler(mockClient, {
      rootId: 'root-1',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      page: undefined,
      hitsPerPage: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional page parameter', async () => {
    const mockResult = { hits: [], nbHits: 0, page: 2 };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listCustomContentDefinition.handler(mockClient, {
      rootId: 'root-1',
      page: 2,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      page: 2,
      hitsPerPage: undefined,
    });
  });

  it('should pass optional hitsPerPage parameter', async () => {
    const mockResult = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listCustomContentDefinition.handler(mockClient, {
      rootId: 'root-1',
      hitsPerPage: 50,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      page: undefined,
      hitsPerPage: 50,
    });
  });

  it('should pass all optional parameters', async () => {
    const mockResult = { hits: [], nbHits: 0, page: 1 };

    const mockClient = createMockClientWithResponse('get', mockResult);

    await listCustomContentDefinition.handler(mockClient, {
      rootId: 'root-1',
      page: 1,
      hitsPerPage: 25,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      page: 1,
      hitsPerPage: 25,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'List failed');

    await expect(
      listCustomContentDefinition.handler(mockClient, { rootId: 'root-1' }),
    ).rejects.toThrow('List failed');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      listCustomContentDefinition.handler(mockClient, { rootId: 'root-1' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCustomContentDefinition.name).toBe('list_custom_content');
    expect(listCustomContentDefinition.description).toBeDefined();
    expect(listCustomContentDefinition.inputSchema).toEqual(ListCustomContentParamsSchema);
  });
});
