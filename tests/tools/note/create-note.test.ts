import { CreateNoteParamsSchema } from '@src/schemas/note';
import { createNoteDefinition } from '@src/tools/note/create-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createNote tool', () => {
  it('should return formatted MCP response with created note', async () => {
    const mockCreatedNote = {
      id: 'note-1',
      title: 'New Note',
      markdown: '# Hello',
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedNote);

    const result = await createNoteDefinition.handler(mockClient, {
      title: 'New Note',
      markdown: '# Hello',
    });

    expectMcpContent(result, mockCreatedNote);
    expect(mockClient.post).toHaveBeenCalledWith('/notes', {
      title: 'New Note',
      parentNoteId: undefined,
      templateId: undefined,
      markdown: '# Hello',
      html: undefined,
      attributes: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should create note with title only', async () => {
    const mockCreatedNote = {
      id: 'note-2',
      title: 'Simple Note',
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedNote);

    const result = await createNoteDefinition.handler(mockClient, {
      title: 'Simple Note',
    });

    expectMcpContent(result, mockCreatedNote);
    expect(mockClient.post).toHaveBeenCalledWith('/notes', {
      title: 'Simple Note',
      parentNoteId: undefined,
      templateId: undefined,
      markdown: undefined,
      html: undefined,
      attributes: undefined,
    });
  });

  it('should create note with all optional parameters', async () => {
    const mockCreatedNote = {
      id: 'note-3',
      title: 'Full Note',
      parentNoteId: 'parent-1',
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedNote);

    await createNoteDefinition.handler(mockClient, {
      title: 'Full Note',
      parentNoteId: 'parent-1',
      templateId: 'template-1',
      markdown: '# Content',
      html: '<h1>Content</h1>',
      attributes: ['attr1', 'attr2'],
    });

    expect(mockClient.post).toHaveBeenCalledWith('/notes', {
      title: 'Full Note',
      parentNoteId: 'parent-1',
      templateId: 'template-1',
      markdown: '# Content',
      html: '<h1>Content</h1>',
      attributes: ['attr1', 'attr2'],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create note');

    await expect(createNoteDefinition.handler(mockClient, { title: 'Test' })).rejects.toThrow(
      'Failed to create note',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(createNoteDefinition.handler(mockClient, { title: 'Test' })).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createNoteDefinition.name).toBe('create_note');
    expect(createNoteDefinition.description).toBeDefined();
    expect(createNoteDefinition.inputSchema).toEqual(CreateNoteParamsSchema);
  });
});
