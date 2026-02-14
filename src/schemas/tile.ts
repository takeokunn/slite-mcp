import { z } from 'zod';
import { NoteIdSchema } from './common';

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

export type UpdateTileParams = z.infer<typeof UpdateTileParamsSchema>;
