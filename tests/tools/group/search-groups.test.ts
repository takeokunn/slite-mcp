import { SearchGroupsParamsSchema } from '@src/schemas/group';
import { searchGroupsDefinition } from '@src/tools/group/search-groups';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchGroups tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockResults = {
      groups: [
        { id: 'group-1', name: 'Engineering' },
        { id: 'group-2', name: 'Engineering Leads' },
      ],
      hasNextPage: false,
    };

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchGroupsDefinition.handler(mockClient, {
      query: 'engineering',
    });

    expectMcpContent(result, mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/groups', {
      query: 'engineering',
      cursor: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional cursor parameter', async () => {
    const mockResults = {
      groups: [{ id: 'group-3', name: 'Design' }],
      hasNextPage: true,
      cursor: 'next-page',
    };

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchGroupsDefinition.handler(mockClient, {
      query: 'design',
      cursor: 'some-cursor',
    });

    expectMcpContent(result, mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/groups', {
      query: 'design',
      cursor: 'some-cursor',
    });
  });

  it('should handle empty search results', async () => {
    const mockResults = { groups: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchGroupsDefinition.handler(mockClient, {
      query: 'nonexistent',
    });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.groups).toEqual([]);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Search failed');

    await expect(searchGroupsDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Search failed',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(searchGroupsDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchGroupsDefinition.name).toBe('search_groups');
    expect(searchGroupsDefinition.description).toBeDefined();
    expect(searchGroupsDefinition.inputSchema).toEqual(SearchGroupsParamsSchema);
  });
});
