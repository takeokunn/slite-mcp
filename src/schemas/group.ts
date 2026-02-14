import { z } from 'zod';
import { CursorSchema, GroupIdSchema } from './common';

export const GetGroupParamsSchema = z.object({
  groupId: GroupIdSchema,
});

export const SearchGroupsParamsSchema = z.object({
  query: z.string().min(1).describe('Search term (group name)'),
  cursor: CursorSchema,
});

export type GetGroupParams = z.infer<typeof GetGroupParamsSchema>;
export type SearchGroupsParams = z.infer<typeof SearchGroupsParamsSchema>;
