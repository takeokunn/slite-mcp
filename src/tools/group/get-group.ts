import type { SliteClient } from '@src/client';
import { type GetGroupParams, GetGroupParamsSchema } from '@src/schemas/group';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single group by ID
 */
export const getGroupDefinition: ToolDefinition<GetGroupParams> = {
  name: 'get_group',
  description: 'Get a single group by ID from Slite',
  inputSchema: GetGroupParamsSchema,
  handler: async (client: SliteClient, input: GetGroupParams) => {
    const result = await client.get(`/groups/${input.groupId}`);
    return formatToolResponse(result);
  },
};
