import type { SliteClient } from '@src/client';
import { type UpdateNoteParams, UpdateNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateNoteDefinition: ToolDefinition<UpdateNoteParams> = {
  name: 'update_note',
  description: 'Update the content or title of a note in Slite',
  inputSchema: UpdateNoteParamsSchema,
  handler: async (client: SliteClient, input: UpdateNoteParams) => {
    const { noteId, ...body } = input;
    const result = await client.put(`/notes/${noteId}`, body);
    return formatToolResponse(result);
  },
};
