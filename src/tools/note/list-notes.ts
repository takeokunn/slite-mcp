import type { SliteClient } from '@src/client';
import { type ListNotesParams, ListNotesParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing notes with optional filtering
 */
export const listNotesDefinition: ToolDefinition<ListNotesParams> = {
  name: 'list_notes',
  description: 'List notes with optional filtering in Slite',
  inputSchema: ListNotesParamsSchema,
  handler: async (client: SliteClient, input: ListNotesParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      ownerId: input.ownerId,
      parentNoteId: input.parentNoteId,
      orderBy: input.orderBy,
      cursor: input.cursor,
    };
    const result = await client.get('/notes', params);
    return formatToolResponse(result);
  },
};
