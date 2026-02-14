import type { SliteClient } from '@src/client';
import { type UpdateNoteOwnerParams, UpdateNoteOwnerParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateNoteOwnerDefinition: ToolDefinition<UpdateNoteOwnerParams> = {
  name: 'update_note_owner',
  description: 'Change the owner of a note in Slite',
  inputSchema: UpdateNoteOwnerParamsSchema,
  handler: async (client: SliteClient, input: UpdateNoteOwnerParams) => {
    const { noteId, ...body } = input;
    const result = await client.put(`/notes/${noteId}/owner`, body);
    return formatToolResponse(result);
  },
};
