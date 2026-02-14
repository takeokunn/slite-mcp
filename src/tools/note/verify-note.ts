import type { SliteClient } from '@src/client';
import { type VerifyNoteParams, VerifyNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for marking a Slite note as verified
 */
export const verifyNoteDefinition: ToolDefinition<VerifyNoteParams> = {
  name: 'verify_note',
  description: 'Set a verified status on a note in Slite',
  inputSchema: VerifyNoteParamsSchema,
  handler: async (client: SliteClient, input: VerifyNoteParams) => {
    const result = await client.put(`/notes/${input.noteId}/verify`, {
      until: input.until,
    });
    return formatToolResponse(result);
  },
};
