import { UpdateNoteParamsSchema } from '@src/schemas/note';
import { updateNoteDefinition } from '@src/tools/note/update-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateNote tool', () => {
  it('should return formatted MCP response with updated note', async () => {
    const mockUpdatedNote = {
      id: 'note-1',
      title: 'Updated Title',
      markdown: '# Updated',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedNote);

    const result = await updateNoteDefinition.handler(mockClient, {
      noteId: 'note-1',
      title: 'Updated Title',
      markdown: '# Updated',
    });

    expectMcpContent(result, mockUpdatedNote);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-1', {
      title: 'Updated Title',
      markdown: '# Updated',
      html: undefined,
      attributes: undefined,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update note title only', async () => {
    const mockUpdatedNote = {
      id: 'note-2',
      title: 'New Title',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedNote);

    const result = await updateNoteDefinition.handler(mockClient, {
      noteId: 'note-2',
      title: 'New Title',
    });

    expectMcpContent(result, mockUpdatedNote);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-2', {
      title: 'New Title',
      markdown: undefined,
      html: undefined,
      attributes: undefined,
    });
  });

  it('should update note with html content', async () => {
    const mockUpdatedNote = {
      id: 'note-3',
      html: '<p>Updated content</p>',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedNote);

    const result = await updateNoteDefinition.handler(mockClient, {
      noteId: 'note-3',
      html: '<p>Updated content</p>',
    });

    expectMcpContent(result, mockUpdatedNote);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-3', {
      title: undefined,
      markdown: undefined,
      html: '<p>Updated content</p>',
      attributes: undefined,
    });
  });

  it('should update note with all optional parameters', async () => {
    const mockUpdatedNote = { id: 'note-4', title: 'Full Update' };

    const mockClient = createMockClientWithResponse('put', mockUpdatedNote);

    await updateNoteDefinition.handler(mockClient, {
      noteId: 'note-4',
      title: 'Full Update',
      markdown: '# Full',
      html: '<h1>Full</h1>',
      attributes: ['col1', 'col2'],
    });

    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-4', {
      title: 'Full Update',
      markdown: '# Full',
      html: '<h1>Full</h1>',
      attributes: ['col1', 'col2'],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Note not found');

    await expect(
      updateNoteDefinition.handler(mockClient, {
        noteId: 'nonexistent',
        title: 'Test',
      }),
    ).rejects.toThrow('Note not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateNoteDefinition.handler(mockClient, {
        noteId: 'note-1',
        title: 'Test',
      }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateNoteDefinition.name).toBe('update_note');
    expect(updateNoteDefinition.description).toBeDefined();
    expect(updateNoteDefinition.inputSchema).toEqual(UpdateNoteParamsSchema);
  });
});
