import type { SliteClient } from '@src/client';
import { type SearchGroupsParams, SearchGroupsParamsSchema } from '@src/schemas/group';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching groups by name
 */
export const searchGroupsDefinition: ToolDefinition<SearchGroupsParams> = {
  name: 'search_groups',
  description: 'Search groups by name in Slite',
  inputSchema: SearchGroupsParamsSchema,
  handler: async (client: SliteClient, input: SearchGroupsParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      query: input.query,
    };
    if (input.cursor !== undefined) params.cursor = input.cursor;
    const results = await client.get('/groups', params);
    return formatToolResponse(results);
  },
};
