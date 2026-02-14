import { FlagNoteAsOutdatedParamsSchema } from '@src/schemas/note';
import { flagNoteAsOutdatedDefinition } from '@src/tools/note/flag-note-as-outdated';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('flagNoteAsOutdated tool', () => {
  it('should return formatted MCP response after flagging note', async () => {
    const mockResult = {
      id: 'note-1',
      reviewState: 'Outdated',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await flagNoteAsOutdatedDefinition.handler(mockClient, {
      noteId: 'note-1',
      reason: 'Information is no longer accurate',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-1/flag-as-outdated', {
      reason: 'Information is no longer accurate',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should flag note with different reason', async () => {
    const mockResult = { id: 'note-2', reviewState: 'Outdated' };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await flagNoteAsOutdatedDefinition.handler(mockClient, {
      noteId: 'note-2',
      reason: 'Process has changed',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-2/flag-as-outdated', {
      reason: 'Process has changed',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Note not found');

    await expect(
      flagNoteAsOutdatedDefinition.handler(mockClient, {
        noteId: 'nonexistent',
        reason: 'test',
      }),
    ).rejects.toThrow('Note not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      flagNoteAsOutdatedDefinition.handler(mockClient, {
        noteId: 'note-1',
        reason: 'test',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(flagNoteAsOutdatedDefinition.name).toBe('flag_note_as_outdated');
    expect(flagNoteAsOutdatedDefinition.description).toBeDefined();
    expect(flagNoteAsOutdatedDefinition.inputSchema).toEqual(FlagNoteAsOutdatedParamsSchema);
  });
});
