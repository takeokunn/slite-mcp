import type { ToolDefinition } from '@src/tools/registry';
import { getUserDefinition } from './get-user';
import { searchUsersDefinition } from './search-users';

/**
 * All user-related tool definitions
 */
export const userTools: ToolDefinition<unknown>[] = [getUserDefinition, searchUsersDefinition];
