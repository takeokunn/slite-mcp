import { UpdateNoteOwnerParamsSchema } from '@src/schemas/note';
import { updateNoteOwnerDefinition } from '@src/tools/note/update-note-owner';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateNoteOwner tool', () => {
  it('should return formatted MCP response after setting user owner', async () => {
    const mockResult = {
      id: 'note-1',
      ownerId: 'user-1',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateNoteOwnerDefinition.handler(mockClient, {
      noteId: 'note-1',
      userId: 'user-1',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-1/owner', {
      userId: 'user-1',
      groupId: undefined,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should set group as owner', async () => {
    const mockResult = {
      id: 'note-2',
      ownerGroupId: 'group-1',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateNoteOwnerDefinition.handler(mockClient, {
      noteId: 'note-2',
      groupId: 'group-1',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-2/owner', {
      userId: undefined,
      groupId: 'group-1',
    });
  });

  it('should pass both userId and groupId', async () => {
    const mockResult = { id: 'note-3' };

    const mockClient = createMockClientWithResponse('put', mockResult);

    await updateNoteOwnerDefinition.handler(mockClient, {
      noteId: 'note-3',
      userId: 'user-1',
      groupId: 'group-1',
    });

    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-3/owner', {
      userId: 'user-1',
      groupId: 'group-1',
    });
  });

  it('should handle no userId or groupId', async () => {
    const mockResult = { id: 'note-4' };

    const mockClient = createMockClientWithResponse('put', mockResult);

    await updateNoteOwnerDefinition.handler(mockClient, {
      noteId: 'note-4',
    });

    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-4/owner', {
      userId: undefined,
      groupId: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Note not found');

    await expect(
      updateNoteOwnerDefinition.handler(mockClient, {
        noteId: 'nonexistent',
        userId: 'user-1',
      }),
    ).rejects.toThrow('Note not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateNoteOwnerDefinition.handler(mockClient, {
        noteId: 'note-1',
        userId: 'user-1',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateNoteOwnerDefinition.name).toBe('update_note_owner');
    expect(updateNoteOwnerDefinition.description).toBeDefined();
    expect(updateNoteOwnerDefinition.inputSchema).toEqual(UpdateNoteOwnerParamsSchema);
  });
});
