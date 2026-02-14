import type { SliteClient } from '@src/client';
import { type CreateNoteParams, CreateNoteParamsSchema } from '@src/schemas/note';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createNoteDefinition: ToolDefinition<CreateNoteParams> = {
  name: 'create_note',
  description: 'Create a note from markdown content in Slite',
  inputSchema: CreateNoteParamsSchema,
  handler: async (client: SliteClient, input: CreateNoteParams) => {
    const { title, parentNoteId, templateId, markdown, html, attributes } = input;
    const result = await client.post('/notes', {
      title,
      parentNoteId,
      templateId,
      markdown,
      html,
      attributes,
    });
    return formatToolResponse(result);
  },
};
