import type { ToolDefinition } from '@src/tools/registry';
import { getGroupDefinition } from './get-group';
import { searchGroupsDefinition } from './search-groups';

/**
 * All group-related tool definitions
 */
export const groupTools: ToolDefinition<unknown>[] = [getGroupDefinition, searchGroupsDefinition];
