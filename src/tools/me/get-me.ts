import type { SliteClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting authenticated user information
 */
export const getMeDefinition: ToolDefinition = {
  name: 'get_me',
  description: 'Get authenticated user information from Slite',
  inputSchema: {},
  handler: async (client: SliteClient) => {
    const result = await client.get('/me');
    return formatToolResponse(result);
  },
};
