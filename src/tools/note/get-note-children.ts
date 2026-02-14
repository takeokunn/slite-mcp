import type { SliteClient } from '@src/client';
import { type GetNoteChildrenParams, GetNoteChildrenParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting child notes of a parent note
 */
export const getNoteChildrenDefinition: ToolDefinition<GetNoteChildrenParams> = {
  name: 'get_note_children',
  description: 'Get the children of a note in Slite',
  inputSchema: GetNoteChildrenParamsSchema,
  handler: async (client: SliteClient, input: GetNoteChildrenParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      cursor: input.cursor,
    };
    const result = await client.get(`/notes/${input.noteId}/children`, params);
    return formatToolResponse(result);
  },
};
