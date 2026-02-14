import { z } from 'zod';
import { ReviewStateSchema } from './common';

export const SearchNotesParamsSchema = z.object({
  query: z.string().optional().describe('Search query'),
  parentNoteId: z.string().optional().describe('Filter by parent note'),
  depth: z.number().optional().describe('Filter by note depth level'),
  reviewState: ReviewStateSchema.optional().describe('Filter by review status'),
  page: z.number().int().min(0).optional().describe('Page number'),
  hitsPerPage: z.number().int().min(1).max(100).optional().describe('Results per page'),
  highlightPreTag: z.string().optional().describe('Tag before matching query'),
  highlightPostTag: z.string().optional().describe('Tag after matching query'),
  lastEditedAfter: z.string().optional().describe('Filter notes edited after date (ISO 8601)'),
  includeArchived: z.boolean().optional().describe('Include archived notes'),
});

export type SearchNotesParams = z.infer<typeof SearchNotesParamsSchema>;
