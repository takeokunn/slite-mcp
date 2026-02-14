import { GetNoteChildrenParamsSchema } from '@src/schemas/note';
import { getNoteChildrenDefinition } from '@src/tools/note/get-note-children';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getNoteChildren tool', () => {
  it('should return formatted MCP response with children', async () => {
    const mockChildren = {
      notes: [
        { id: 'child-1', title: 'Child Note 1' },
        { id: 'child-2', title: 'Child Note 2' },
      ],
      hasNextPage: false,
    };

    const mockClient = createMockClientWithResponse('get', mockChildren);

    const result = await getNoteChildrenDefinition.handler(mockClient, {
      noteId: 'parent-1',
    });

    expectMcpContent(result, mockChildren);
    expect(mockClient.get).toHaveBeenCalledWith('/notes/parent-1/children', {
      cursor: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional cursor parameter', async () => {
    const mockChildren = {
      notes: [{ id: 'child-3', title: 'Child Note 3' }],
      hasNextPage: true,
      cursor: 'next-page',
    };

    const mockClient = createMockClientWithResponse('get', mockChildren);

    const result = await getNoteChildrenDefinition.handler(mockClient, {
      noteId: 'parent-1',
      cursor: 'some-cursor',
    });

    expectMcpContent(result, mockChildren);
    expect(mockClient.get).toHaveBeenCalledWith('/notes/parent-1/children', {
      cursor: 'some-cursor',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Note not found');

    await expect(
      getNoteChildrenDefinition.handler(mockClient, { noteId: 'nonexistent' }),
    ).rejects.toThrow('Note not found');
    expect(mockClient.get).toHaveBeenCalledWith('/notes/nonexistent/children', {
      cursor: undefined,
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(
      getNoteChildrenDefinition.handler(mockClient, { noteId: 'note-1' }),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getNoteChildrenDefinition.name).toBe('get_note_children');
    expect(getNoteChildrenDefinition.description).toBeDefined();
    expect(getNoteChildrenDefinition.inputSchema).toEqual(GetNoteChildrenParamsSchema);
  });
});
