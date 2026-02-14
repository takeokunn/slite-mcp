import type { SliteClient } from '@src/client';
import { type ArchiveNoteParams, ArchiveNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const archiveNoteDefinition: ToolDefinition<ArchiveNoteParams> = {
  name: 'archive_note',
  description: 'Archive or unarchive a note in Slite',
  inputSchema: ArchiveNoteParamsSchema,
  handler: async (client: SliteClient, input: ArchiveNoteParams) => {
    const result = await client.put(`/notes/${input.noteId}/archived`, {
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
