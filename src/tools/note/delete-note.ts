import type { SliteClient } from '@src/client';
import { type DeleteNoteParams, DeleteNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteNoteDefinition: ToolDefinition<DeleteNoteParams> = {
  name: 'delete_note',
  description: 'Delete a note and its children from Slite',
  inputSchema: DeleteNoteParamsSchema,
  handler: async (client: SliteClient, input: DeleteNoteParams) => {
    await client.delete(`/notes/${input.noteId}`);
    return formatToolResponse({ success: true });
  },
};
