import { z } from 'zod';
import { CursorSchema, UserIdSchema } from './common';

export const GetUserParamsSchema = z.object({
  userId: UserIdSchema,
});

export const SearchUsersParamsSchema = z.object({
  query: z.string().min(1).describe('Search term (email, name, or username)'),
  includeArchived: z.boolean().optional().describe('Include archived users'),
  cursor: CursorSchema,
});

export type GetUserParams = z.infer<typeof GetUserParamsSchema>;
export type SearchUsersParams = z.infer<typeof SearchUsersParamsSchema>;
