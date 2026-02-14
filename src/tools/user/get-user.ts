import type { SliteClient } from '@src/client';
import { type GetUserParams, GetUserParamsSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single user by ID
 */
export const getUserDefinition: ToolDefinition<GetUserParams> = {
  name: 'get_user',
  description: 'Get a single user by ID from Slite',
  inputSchema: GetUserParamsSchema,
  handler: async (client: SliteClient, input: GetUserParams) => {
    const result = await client.get(`/users/${input.userId}`);
    return formatToolResponse(result);
  },
};
