import type { SliteClient } from '@src/client';
import { type GetNoteParams, GetNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single note by ID from Slite
 */
export const getNoteDefinition: ToolDefinition<GetNoteParams> = {
  name: 'get_note',
  description: 'Get a note by ID from Slite',
  inputSchema: GetNoteParamsSchema,
  handler: async (client: SliteClient, input: GetNoteParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      format: input.format,
    };
    const result = await client.get(`/notes/${input.noteId}`, params);
    return formatToolResponse(result);
  },
};
