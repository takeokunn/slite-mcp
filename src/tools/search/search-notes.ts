import type { SliteClient } from '@src/client';
import { type SearchNotesParams, SearchNotesParamsSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching notes in Slite
 */
export const searchNotesDefinition: ToolDefinition<SearchNotesParams> = {
  name: 'search_notes',
  description: 'Search notes based on a query in Slite',
  inputSchema: SearchNotesParamsSchema,
  handler: async (client: SliteClient, input: SearchNotesParams) => {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.query !== undefined) params.query = input.query;
    if (input.parentNoteId !== undefined) params.parentNoteId = input.parentNoteId;
    if (input.depth !== undefined) params.depth = input.depth;
    if (input.reviewState !== undefined) params.reviewState = input.reviewState;
    if (input.page !== undefined) params.page = input.page;
    if (input.hitsPerPage !== undefined) params.hitsPerPage = input.hitsPerPage;
    if (input.highlightPreTag !== undefined) {
      params.highlightPreTag = input.highlightPreTag;
    }
    if (input.highlightPostTag !== undefined) {
      params.highlightPostTag = input.highlightPostTag;
    }
    if (input.lastEditedAfter !== undefined) {
      params.lastEditedAfter = input.lastEditedAfter;
    }
    if (input.includeArchived !== undefined) {
      params.includeArchived = input.includeArchived;
    }
    const results = await client.get('/search-notes', params);
    return formatToolResponse(results);
  },
};
