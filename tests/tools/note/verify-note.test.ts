import { VerifyNoteParamsSchema } from '@src/schemas/note';
import { verifyNoteDefinition } from '@src/tools/note/verify-note';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('verifyNote tool', () => {
  it('should return formatted MCP response after verifying note', async () => {
    const mockResult = {
      id: 'note-1',
      reviewState: 'Verified',
      verifiedUntil: '2025-12-31T23:59:59Z',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await verifyNoteDefinition.handler(mockClient, {
      noteId: 'note-1',
      until: '2025-12-31T23:59:59Z',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-1/verify', {
      until: '2025-12-31T23:59:59Z',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should verify note with null expiration', async () => {
    const mockResult = {
      id: 'note-2',
      reviewState: 'Verified',
      verifiedUntil: null,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await verifyNoteDefinition.handler(mockClient, {
      noteId: 'note-2',
      until: null,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/notes/note-2/verify', {
      until: null,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Note not found');

    await expect(
      verifyNoteDefinition.handler(mockClient, {
        noteId: 'nonexistent',
        until: '2025-12-31T23:59:59Z',
      }),
    ).rejects.toThrow('Note not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      verifyNoteDefinition.handler(mockClient, {
        noteId: 'note-1',
        until: '2025-12-31T23:59:59Z',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(verifyNoteDefinition.name).toBe('verify_note');
    expect(verifyNoteDefinition.description).toBeDefined();
    expect(verifyNoteDefinition.inputSchema).toEqual(VerifyNoteParamsSchema);
  });
});
