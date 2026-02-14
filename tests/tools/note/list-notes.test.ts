import { ListNotesParamsSchema } from '@src/schemas/note';
import { listNotesDefinition } from '@src/tools/note/list-notes';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listNotes tool', () => {
  it('should return formatted MCP response with notes list', async () => {
    const mockNotes = {
      notes: [
        { id: 'note-1', title: 'First Note' },
        { id: 'note-2', title: 'Second Note' },
      ],
      hasNextPage: false,
    };

    const mockClient = createMockClientWithResponse('get', mockNotes);

    const result = await listNotesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockNotes);
    expect(mockClient.get).toHaveBeenCalledWith('/notes', {
      ownerId: undefined,
      parentNoteId: undefined,
      orderBy: undefined,
      cursor: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional ownerId parameter', async () => {
    const mockNotes = { notes: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockNotes);

    await listNotesDefinition.handler(mockClient, {
      ownerId: 'user-1',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/notes', {
      ownerId: 'user-1',
      parentNoteId: undefined,
      orderBy: undefined,
      cursor: undefined,
    });
  });

  it('should pass optional parentNoteId parameter', async () => {
    const mockNotes = { notes: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockNotes);

    await listNotesDefinition.handler(mockClient, {
      parentNoteId: 'parent-1',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/notes', {
      ownerId: undefined,
      parentNoteId: 'parent-1',
      orderBy: undefined,
      cursor: undefined,
    });
  });

  it('should pass optional orderBy parameter', async () => {
    const mockNotes = { notes: [], hasNextPage: false };

    const mockClient = createMockClientWithResponse('get', mockNotes);

    await listNotesDefinition.handler(mockClient, {
      orderBy: 'lastEditedAt_DESC',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/notes', {
      ownerId: undefined,
      parentNoteId: undefined,
      orderBy: 'lastEditedAt_DESC',
      cursor: undefined,
    });
  });

  it('should pass all optional parameters', async () => {
    const mockNotes = { notes: [], hasNextPage: true, cursor: 'next-cursor' };

    const mockClient = createMockClientWithResponse('get', mockNotes);

    await listNotesDefinition.handler(mockClient, {
      ownerId: 'user-1',
      parentNoteId: 'parent-1',
      orderBy: 'listPosition_ASC',
      cursor: 'some-cursor',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/notes', {
      ownerId: 'user-1',
      parentNoteId: 'parent-1',
      orderBy: 'listPosition_ASC',
      cursor: 'some-cursor',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'List failed');

    await expect(listNotesDefinition.handler(mockClient, {})).rejects.toThrow('List failed');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listNotesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listNotesDefinition.name).toBe('list_notes');
    expect(listNotesDefinition.description).toBeDefined();
    expect(listNotesDefinition.inputSchema).toEqual(ListNotesParamsSchema);
  });
});
