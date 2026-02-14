import type { SliteClient } from '@src/client';
import { type UpdateTileParams, UpdateTileParamsSchema } from '@src/schemas/tile';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating or creating a tile in a Slite note
 */
export const updateTileDefinition: ToolDefinition<UpdateTileParams> = {
  name: 'update_tile',
  description: 'Update or create a tile in a Slite note',
  inputSchema: UpdateTileParamsSchema,
  handler: async (client: SliteClient, input: UpdateTileParams) => {
    const { noteId, tileId, ...body } = input;
    const result = await client.put(`/notes/${noteId}/tiles/${tileId}`, body);
    return formatToolResponse(result);
  },
};
