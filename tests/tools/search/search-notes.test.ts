import { SearchNotesParamsSchema } from '@src/schemas/search';
import { searchNotesDefinition } from '@src/tools/search/search-notes';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchNotes tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockSearchResults = {
      hits: [
        { id: 'note-1', title: 'Getting Started', highlight: {} },
        { id: 'note-2', title: 'API Reference', highlight: {} },
      ],
      nbHits: 2,
      page: 0,
    };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    const result = await searchNotesDefinition.handler(mockClient, {
      query: 'getting started',
    });

    expectMcpContent(result, mockSearchResults);
    expect(mockClient.get).toHaveBeenCalledWith('/search-notes', {
      query: 'getting started',
      parentNoteId: undefined,
      depth: undefined,
      reviewState: undefined,
      page: undefined,
      hitsPerPage: undefined,
      highlightPreTag: undefined,
      highlightPostTag: undefined,
      lastEditedAfter: undefined,
      includeArchived: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty search results', async () => {
    const mockSearchResults = { hits: [], nbHits: 0, page: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    const result = await searchNotesDefinition.handler(mockClient, {
      query: 'nonexistent',
    });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.hits).toEqual([]);
    expect(parsedResult.nbHits).toBe(0);
  });

  it('should pass optional parentNoteId filter', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      parentNoteId: 'parent-1',
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        query: 'test',
        parentNoteId: 'parent-1',
      }),
    );
  });

  it('should pass optional reviewState filter', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      reviewState: 'Verified',
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        reviewState: 'Verified',
      }),
    );
  });

  it('should pass pagination parameters', async () => {
    const mockSearchResults = { hits: [], nbHits: 100, page: 2 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      page: 2,
      hitsPerPage: 25,
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        page: 2,
        hitsPerPage: 25,
      }),
    );
  });

  it('should pass highlight parameters', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      highlightPreTag: '<em>',
      highlightPostTag: '</em>',
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        highlightPreTag: '<em>',
        highlightPostTag: '</em>',
      }),
    );
  });

  it('should pass optional depth and lastEditedAfter', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      depth: 2,
      lastEditedAfter: '2025-01-01T00:00:00Z',
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        depth: 2,
        lastEditedAfter: '2025-01-01T00:00:00Z',
      }),
    );
  });

  it('should pass optional includeArchived', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'test',
      includeArchived: true,
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/search-notes',
      expect.objectContaining({
        includeArchived: true,
      }),
    );
  });

  it('should pass all parameters when provided', async () => {
    const mockSearchResults = { hits: [], nbHits: 0 };

    const mockClient = createMockClientWithResponse('get', mockSearchResults);

    await searchNotesDefinition.handler(mockClient, {
      query: 'comprehensive',
      parentNoteId: 'parent-1',
      depth: 3,
      reviewState: 'Outdated',
      page: 1,
      hitsPerPage: 50,
      highlightPreTag: '<b>',
      highlightPostTag: '</b>',
      lastEditedAfter: '2025-06-01T00:00:00Z',
      includeArchived: false,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/search-notes', {
      query: 'comprehensive',
      parentNoteId: 'parent-1',
      depth: 3,
      reviewState: 'Outdated',
      page: 1,
      hitsPerPage: 50,
      highlightPreTag: '<b>',
      highlightPostTag: '</b>',
      lastEditedAfter: '2025-06-01T00:00:00Z',
      includeArchived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Search failed');

    await expect(searchNotesDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Search failed',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(searchNotesDefinition.handler(mockClient, { query: 'test' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchNotesDefinition.name).toBe('search_notes');
    expect(searchNotesDefinition.description).toBeDefined();
    expect(searchNotesDefinition.inputSchema).toEqual(SearchNotesParamsSchema);
  });
});
