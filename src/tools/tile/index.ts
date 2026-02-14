import type { ToolDefinition } from '@src/tools/registry';
import { updateTileDefinition } from './update-tile';

/**
 * Tile management tool definitions
 */
export const tileTools: ToolDefinition<unknown>[] = [updateTileDefinition];
