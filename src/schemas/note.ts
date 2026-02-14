import { z } from 'zod';
import { ContentFormatSchema, CursorSchema, ListNotesOrderBySchema, NoteIdSchema } from './common';

export const CreateNoteParamsSchema = z.object({
  title: z.string().min(1).describe('Note title'),
  parentNoteId: z.string().optional().describe('Parent note ID'),
  templateId: z.string().optional().describe('Template ID to apply'),
  markdown: z.string().optional().describe('Markdown content'),
  html: z.string().optional().describe('HTML content'),
  attributes: z.array(z.string()).optional().describe('Collection attributes ordered by column'),
});

export const ListNotesParamsSchema = z.object({
  ownerId: z.string().optional().describe('Filter by owner user ID'),
  parentNoteId: z.string().optional().describe('Filter by parent note'),
  orderBy: ListNotesOrderBySchema.optional().describe('Order of results'),
  cursor: CursorSchema,
});

export const GetNoteParamsSchema = z.object({
  noteId: NoteIdSchema,
  format: ContentFormatSchema.optional().describe('Content format: md or html'),
});

export const DeleteNoteParamsSchema = z.object({
  noteId: NoteIdSchema,
});

export const UpdateNoteParamsSchema = z.object({
  noteId: NoteIdSchema,
  title: z.string().optional().describe('New title'),
  markdown: z.string().optional().describe('New markdown content'),
  html: z.string().optional().describe('New HTML content'),
  attributes: z.array(z.string()).optional().describe('Updated collection attributes'),
});

export const GetNoteChildrenParamsSchema = z.object({
  noteId: NoteIdSchema,
  cursor: CursorSchema,
});

export const VerifyNoteParamsSchema = z.object({
  noteId: NoteIdSchema,
  until: z
    .string()
    .nullable()
    .describe('Verification expiration (ISO 8601, null for no expiration)'),
});

export const FlagNoteAsOutdatedParamsSchema = z.object({
  noteId: NoteIdSchema,
  reason: z.string().min(1).describe('Reason for flagging as outdated'),
});

export const ArchiveNoteParamsSchema = z.object({
  noteId: NoteIdSchema,
  archived: z.boolean().describe('true to archive, false to unarchive'),
});

export const UpdateNoteOwnerParamsSchema = z.object({
  noteId: NoteIdSchema,
  userId: z.string().optional().describe('User ID to set as owner'),
  groupId: z.string().optional().describe('Group ID to set as owner'),
});

export const UpdateTileParamsSchema = z.object({
  noteId: NoteIdSchema,
  tileId: z.string().min(1).describe('Tile ID'),
  title: z.string().nullable().optional().describe('Tile title'),
  iconURL: z.string().nullable().optional().describe('Icon URL'),
  status: z
    .object({
      label: z.string().describe('Status label'),
      colorHex: z.string().optional().describe('Status color hex'),
    })
    .nullable()
    .optional()
    .describe('Status with color'),
  url: z.string().nullable().optional().describe('External URL link'),
  content: z.string().nullable().optional().describe('Markdown content'),
});

export type CreateNoteParams = z.infer<typeof CreateNoteParamsSchema>;
export type ListNotesParams = z.infer<typeof ListNotesParamsSchema>;
export type GetNoteParams = z.infer<typeof GetNoteParamsSchema>;
export type DeleteNoteParams = z.infer<typeof DeleteNoteParamsSchema>;
export type UpdateNoteParams = z.infer<typeof UpdateNoteParamsSchema>;
export type GetNoteChildrenParams = z.infer<typeof GetNoteChildrenParamsSchema>;
export type VerifyNoteParams = z.infer<typeof VerifyNoteParamsSchema>;
export type FlagNoteAsOutdatedParams = z.infer<typeof FlagNoteAsOutdatedParamsSchema>;
export type ArchiveNoteParams = z.infer<typeof ArchiveNoteParamsSchema>;
export type UpdateNoteOwnerParams = z.infer<typeof UpdateNoteOwnerParamsSchema>;
export type UpdateTileParams = z.infer<typeof UpdateTileParamsSchema>;
