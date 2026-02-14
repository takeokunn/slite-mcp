import type { SliteClient } from '@src/client';
import { type SearchUsersParams, SearchUsersParamsSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching users by email, name, or username
 */
export const searchUsersDefinition: ToolDefinition<SearchUsersParams> = {
  name: 'search_users',
  description: 'Search users by email, name, or username in Slite',
  inputSchema: SearchUsersParamsSchema,
  handler: async (client: SliteClient, input: SearchUsersParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      query: input.query,
    };
    if (input.includeArchived !== undefined) {
      params.includeArchived = input.includeArchived;
    }
    if (input.cursor !== undefined) params.cursor = input.cursor;
    const results = await client.get('/users', params);
    return formatToolResponse(results);
  },
};
