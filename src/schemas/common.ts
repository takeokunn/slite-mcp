import { z } from 'zod';

export const NoteIdSchema = z.string().min(1).describe('Note ID');
export const UserIdSchema = z.string().min(1).describe('User ID');
export const GroupIdSchema = z.string().min(1).describe('Group ID');
export const CursorSchema = z.string().optional().describe('Pagination cursor');
export const ReviewStateSchema = z.enum(['Verified', 'Outdated', 'VerificationRequested']);
export const NoteTypeSchema = z.enum(['rich_text', 'discussion', 'collection']);
export const ContentFormatSchema = z.enum(['md', 'html']);
export const ListNotesOrderBySchema = z.enum([
  'lastEditedAt_DESC',
  'lastEditedAt_ASC',
  'listPosition_DESC',
  'listPosition_ASC',
]);

export type NoteId = z.infer<typeof NoteIdSchema>;
export type UserId = z.infer<typeof UserIdSchema>;
export type GroupId = z.infer<typeof GroupIdSchema>;
export type ReviewState = z.infer<typeof ReviewStateSchema>;
export type NoteType = z.infer<typeof NoteTypeSchema>;
export type ContentFormat = z.infer<typeof ContentFormatSchema>;
export type ListNotesOrderBy = z.infer<typeof ListNotesOrderBySchema>;
