import type { SliteClient } from '@src/client';
import { type FlagNoteAsOutdatedParams, FlagNoteAsOutdatedParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const flagNoteAsOutdatedDefinition: ToolDefinition<FlagNoteAsOutdatedParams> = {
  name: 'flag_note_as_outdated',
  description: 'Flag a note as outdated in Slite',
  inputSchema: FlagNoteAsOutdatedParamsSchema,
  handler: async (client: SliteClient, input: FlagNoteAsOutdatedParams) => {
    const result = await client.put(`/notes/${input.noteId}/flag-as-outdated`, {
      reason: input.reason,
    });
    return formatToolResponse(result);
  },
};
