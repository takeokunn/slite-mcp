import { GetNoteParamsSchema } from '@src/schemas/note';
import { getNoteDefinition } from '@src/tools/note/get-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getNote tool', () => {
  it('should return formatted MCP response with note data', async () => {
    const mockNote = {
      id: 'note-1',
      title: 'Test Note',
      content: '# Hello World',
    };

    const mockClient = createMockClientWithResponse('get', mockNote);

    const result = await getNoteDefinition.handler(mockClient, {
      noteId: 'note-1',
    });

    expectMcpContent(result, mockNote);
    expect(mockClient.get).toHaveBeenCalledWith('/notes/note-1', {
      format: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass optional format parameter as md', async () => {
    const mockNote = {
      id: 'note-2',
      title: 'Markdown Note',
      markdown: '# Content',
    };

    const mockClient = createMockClientWithResponse('get', mockNote);

    const result = await getNoteDefinition.handler(mockClient, {
      noteId: 'note-2',
      format: 'md',
    });

    expectMcpContent(result, mockNote);
    expect(mockClient.get).toHaveBeenCalledWith('/notes/note-2', {
      format: 'md',
    });
  });

  it('should pass optional format parameter as html', async () => {
    const mockNote = {
      id: 'note-3',
      title: 'HTML Note',
      html: '<h1>Content</h1>',
    };

    const mockClient = createMockClientWithResponse('get', mockNote);

    const result = await getNoteDefinition.handler(mockClient, {
      noteId: 'note-3',
      format: 'html',
    });

    expectMcpContent(result, mockNote);
    expect(mockClient.get).toHaveBeenCalledWith('/notes/note-3', {
      format: 'html',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Note not found');

    await expect(getNoteDefinition.handler(mockClient, { noteId: 'nonexistent' })).rejects.toThrow(
      'Note not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/notes/nonexistent', {
      format: undefined,
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(getNoteDefinition.handler(mockClient, { noteId: 'note-1' })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getNoteDefinition.name).toBe('get_note');
    expect(getNoteDefinition.description).toBeDefined();
    expect(getNoteDefinition.inputSchema).toEqual(GetNoteParamsSchema);
  });
});
