import { ArchiveNoteParamsSchema } from '@src/schemas/note';
import { archiveNoteDefinition } from '@src/tools/note/archive-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('archiveNote tool', () => {
  it('should return formatted MCP response after archiving note', async () => {
    const mockResult = {
      id: 'note-1',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await archiveNoteDefinition.handler(mockClient, {
      noteId: 'note-1',
      archived: true,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-1/archived', {
      archived: true,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should unarchive note', async () => {
    const mockResult = {
      id: 'note-2',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await archiveNoteDefinition.handler(mockClient, {
      noteId: 'note-2',
      archived: false,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-2/archived', {
      archived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Note not found');

    await expect(
      archiveNoteDefinition.handler(mockClient, {
        noteId: 'nonexistent',
        archived: true,
      }),
    ).rejects.toThrow('Note not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      archiveNoteDefinition.handler(mockClient, {
        noteId: 'note-1',
        archived: true,
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    await expect(
      archiveNoteDefinition.handler(mockClient, {
        noteId: 'note-1',
        archived: true,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(archiveNoteDefinition.name).toBe('archive_note');
    expect(archiveNoteDefinition.description).toBeDefined();
    expect(archiveNoteDefinition.inputSchema).toEqual(ArchiveNoteParamsSchema);
  });
});
