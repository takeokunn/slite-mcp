import type { ToolDefinition } from '@src/tools/registry';
import { searchNotesDefinition } from './search-notes';

/**
 * All search-related tool definitions
 */
export const searchTools: ToolDefinition<unknown>[] = [searchNotesDefinition];
