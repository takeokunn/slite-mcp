import { UpdateTileParamsSchema } from '@src/schemas/tile';
import { updateTileDefinition } from '@src/tools/tile/update-tile';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateTile tool', () => {
  it('should return formatted MCP response with updated tile', async () => {
    const mockResult = {
      id: 'tile-1',
      noteId: 'note-1',
      content: 'Updated content',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateTileDefinition.handler(mockClient, {
      noteId: 'note-1',
      tileId: 'tile-1',
      content: 'Updated content',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith(
      '/notes/note-1/tiles/tile-1',
      expect.objectContaining({ content: 'Updated content' }),
    );
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should pass additional fields in body', async () => {
    const mockResult = {
      id: 'tile-2',
      noteId: 'note-2',
      title: 'Tile Title',
      markdown: '# Tile Content',
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateTileDefinition.handler(mockClient, {
      noteId: 'note-2',
      tileId: 'tile-2',
      title: 'Tile Title',
      markdown: '# Tile Content',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith(
      '/notes/note-2/tiles/tile-2',
      expect.objectContaining({
        title: 'Tile Title',
        markdown: '# Tile Content',
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Tile not found');

    await expect(
      updateTileDefinition.handler(mockClient, {
        noteId: 'note-1',
        tileId: 'nonexistent',
      }),
    ).rejects.toThrow('Tile not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateTileDefinition.handler(mockClient, {
        noteId: 'note-1',
        tileId: 'tile-1',
      }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateTileDefinition.handler(mockClient, {
        noteId: 'note-1',
        tileId: 'tile-1',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateTileDefinition.name).toBe('update_tile');
    expect(updateTileDefinition.description).toBeDefined();
    expect(updateTileDefinition.inputSchema).toEqual(UpdateTileParamsSchema);
  });
});
