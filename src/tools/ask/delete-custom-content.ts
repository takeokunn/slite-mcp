import type { SliteClient } from '@src/client';
import { type DeleteCustomContentParams, DeleteCustomContentParamsSchema } from '@src/schemas/ask';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting indexed custom content
 */
export const deleteCustomContentDefinition: ToolDefinition<DeleteCustomContentParams> = {
  name: 'delete_custom_content',
  description: 'Delete indexed custom content from AskX in Slite (deprecated)',
  inputSchema: DeleteCustomContentParamsSchema,
  handler: async (client: SliteClient, input: DeleteCustomContentParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      rootId: input.rootId,
      id: input.id,
    };
    const result = await client.delete('/ask/index', params);
    return formatToolResponse(result);
  },
};
