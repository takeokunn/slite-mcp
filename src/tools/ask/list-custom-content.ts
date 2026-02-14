import type { SliteClient } from '@src/client';
import { type ListCustomContentParams, ListCustomContentParamsSchema } from '@src/schemas/ask';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing indexed custom content IDs
 */
export const listCustomContentDefinition: ToolDefinition<ListCustomContentParams> = {
  name: 'list_custom_content',
  description: 'List indexed custom content IDs from AskX in Slite (deprecated)',
  inputSchema: ListCustomContentParamsSchema,
  handler: async (client: SliteClient, input: ListCustomContentParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      rootId: input.rootId,
    };
    if (input.page !== undefined) params.page = input.page;
    if (input.hitsPerPage !== undefined) params.hitsPerPage = input.hitsPerPage;
    const result = await client.get('/ask/index', params);
    return formatToolResponse(result);
  },
};
