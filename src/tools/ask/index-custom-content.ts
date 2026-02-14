import type { SliteClient } from '@src/client';
import { type IndexCustomContentParams, IndexCustomContentParamsSchema } from '@src/schemas/ask';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for indexing custom content to AskX
 */
export const indexCustomContentDefinition: ToolDefinition<IndexCustomContentParams> = {
  name: 'index_custom_content',
  description: 'Index custom content to AskX in Slite (deprecated)',
  inputSchema: IndexCustomContentParamsSchema,
  handler: async (client: SliteClient, input: IndexCustomContentParams) => {
    const result = await client.post('/ask/index', {
      rootId: input.rootId,
      id: input.id,
      title: input.title,
      content: input.content,
      type: input.type,
      updatedAt: input.updatedAt,
      url: input.url,
    });
    return formatToolResponse(result);
  },
};
