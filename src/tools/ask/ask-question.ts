import type { SliteClient } from '@src/client';
import { type AskQuestionParams, AskQuestionParamsSchema } from '@src/schemas/ask';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for asking a question to notes using Slite AI
 */
export const askQuestionDefinition: ToolDefinition<AskQuestionParams> = {
  name: 'ask_question',
  description: 'Ask a question to your notes in natural language using Slite AI',
  inputSchema: AskQuestionParamsSchema,
  handler: async (client: SliteClient, input: AskQuestionParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      question: input.question,
      parentNoteId: input.parentNoteId,
      assistantId: input.assistantId,
    };
    const result = await client.post('/ask', undefined, params);
    return formatToolResponse(result);
  },
};
