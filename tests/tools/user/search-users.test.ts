import { SearchUsersParamsSchema } from '@src/schemas/user';
import { searchUsersDefinition } from '@src/tools/user/search-users';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchUsers tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockResults = {
      users: [
        { id: 'user-1', email: 'alice@example.com', firstName: 'Alice' },
        { id: 'user-2', email: 'bob@example.com', firstName: 'Bob' },
      ],
      hasNextPage: false,
    };

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchUsersDefinition.handler(mockClient, {
      query: 'alice',
    });

    expectMcpContent(result, mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/users', {
      query: 'alice',
      includeArchived: undefined,
      cursor: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional includeArchived parameter', async () => {
    const mockResults = { users: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockResults);

    await searchUsersDefinition.handler(mockClient, {
      query: 'test',
      includeArchived: true,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/users', {
      query: 'test',
      includeArchived: true,
      cursor: undefined,
    });
  });

  it('should pass optional cursor parameter', async () => {
    const mockResults = { users: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockResults);

    await searchUsersDefinition.handler(mockClient, {
      query: 'test',
      cursor: 'some-cursor',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/users', {
      query: 'test',
      includeArchived: undefined,
      cursor: 'some-cursor',
    });
  });

  it('should pass all optional parameters', async () => {
    const mockResults = { users: [], hasNextPage: true, cursor: 'next' };

    const mockClient = createMockClientWithResponse('get', mockResults);

    await searchUsersDefinition.handler(mockClient, {
      query: 'search-all',
      includeArchived: false,
      cursor: 'page-2',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/users', {
      query: 'search-all',
      includeArchived: false,
      cursor: 'page-2',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Search failed');

    await expect(searchUsersDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Search failed',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(searchUsersDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchUsersDefinition.name).toBe('search_users');
    expect(searchUsersDefinition.description).toBeDefined();
    expect(searchUsersDefinition.inputSchema).toEqual(SearchUsersParamsSchema);
  });
});
