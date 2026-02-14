import { DeleteNoteParamsSchema } from '@src/schemas/note';
import { deleteNoteDefinition } from '@src/tools/note/delete-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteNote tool', () => {
  it('should return success response after deleting note', async () => {
    const mockClient = createMockClientWithResponse('delete', undefined);

    const result = await deleteNoteDefinition.handler(mockClient, {
      noteId: 'note-1',
    });

    expectMcpContent(result, { success: true });
    expect(mockClient.delete).toHaveBeenCalledWith('/notes/note-1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete note with different ID', async () => {
    const mockClient = createMockClientWithResponse('delete', undefined);

    const result = await deleteNoteDefinition.handler(mockClient, {
      noteId: 'note-abc-123',
    });

    expectMcpContent(result, { success: true });
    expect(mockClient.delete).toHaveBeenCalledWith('/notes/note-abc-123');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Note not found');

    await expect(
      deleteNoteDefinition.handler(mockClient, { noteId: 'nonexistent' }),
    ).rejects.toThrow('Note not found');
    expect(mockClient.delete).toHaveBeenCalledWith('/notes/nonexistent');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteNoteDefinition.handler(mockClient, { noteId: 'note-1' })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteNoteDefinition.handler(mockClient, { noteId: 'note-1' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteNoteDefinition.name).toBe('delete_note');
    expect(deleteNoteDefinition.description).toBeDefined();
    expect(deleteNoteDefinition.inputSchema).toEqual(DeleteNoteParamsSchema);
  });
});
