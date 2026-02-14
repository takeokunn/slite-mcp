import type { ToolDefinition } from '@src/tools/registry';
import { getMeDefinition } from './get-me';

/**
 * All me-related tool definitions
 */
export const meTools: ToolDefinition<unknown>[] = [getMeDefinition];
