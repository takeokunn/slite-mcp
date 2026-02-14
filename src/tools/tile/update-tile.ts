import type { SliteClient } from '@src/client';
import { type UpdateTileParams, UpdateTileParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

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
