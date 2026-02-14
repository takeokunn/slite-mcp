import type { ToolDefinition } from '@src/tools/registry';
import { updateTileDefinition } from './update-tile';

export const tileTools: ToolDefinition<unknown>[] = [updateTileDefinition];
