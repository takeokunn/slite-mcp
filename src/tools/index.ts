import { askTools } from './ask';
import { groupTools } from './group';
import { meTools } from './me';
import { noteTools } from './note';
import type { ToolDefinition } from './registry';
import { searchTools } from './search';
import { tileTools } from './tile';
import { userTools } from './user';

export const allTools: ToolDefinition<unknown>[] = [
  ...askTools,
  ...meTools,
  ...noteTools,
  ...tileTools,
  ...searchTools,
  ...userTools,
  ...groupTools,
];

export type { ToolDefinition, ToolResponse } from './registry';
export { formatErrorResponse, formatToolResponse, registerTools } from './registry';
