import { z } from 'zod';

export const AskQuestionParamsSchema = z.object({
  question: z.string().min(1).describe('Question to ask on notes'),
  parentNoteId: z.string().optional().describe('Restrict scope to specific parent note'),
  assistantId: z.string().optional().describe('Specific assistant for super users'),
});

export const IndexCustomContentParamsSchema = z.object({
  rootId: z.string().describe('Root ID of custom data source'),
  id: z.string().describe('Unique object ID scoped to rootId'),
  title: z.string().describe('Title of object'),
  content: z.string().describe('Content in markdown or html'),
  type: z.enum(['markdown', 'html']).describe('Content type'),
  updatedAt: z.string().describe('Last update date (ISO 8601)'),
  url: z.string().describe('URL of object'),
});

export const DeleteCustomContentParamsSchema = z.object({
  rootId: z.string().describe('Root ID'),
  id: z.string().describe('Object ID to delete'),
});

export const ListCustomContentParamsSchema = z.object({
  rootId: z.string().describe('Root ID'),
  page: z.number().int().min(0).optional().describe('Pagination page number'),
  hitsPerPage: z.number().int().min(1).max(100).optional().describe('Results per page'),
});

export type AskQuestionParams = z.infer<typeof AskQuestionParamsSchema>;
export type IndexCustomContentParams = z.infer<typeof IndexCustomContentParamsSchema>;
export type DeleteCustomContentParams = z.infer<typeof DeleteCustomContentParamsSchema>;
export type ListCustomContentParams = z.infer<typeof ListCustomContentParamsSchema>;
