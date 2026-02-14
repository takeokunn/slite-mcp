import type { ToolDefinition } from '@src/tools/registry';
import { askQuestionDefinition } from './ask-question';
import { deleteCustomContentDefinition } from './delete-custom-content';
import { indexCustomContentDefinition } from './index-custom-content';
import { listCustomContentDefinition } from './list-custom-content';

/**
 * All ask-related tool definitions
 */
export const askTools: ToolDefinition<unknown>[] = [
  askQuestionDefinition,
  indexCustomContentDefinition,
  deleteCustomContentDefinition,
  listCustomContentDefinition,
];
