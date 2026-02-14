import type { ToolDefinition } from '@src/tools/registry';
import { archiveNoteDefinition } from './archive-note';
import { createNoteDefinition } from './create-note';
import { deleteNoteDefinition } from './delete-note';
import { flagNoteAsOutdatedDefinition } from './flag-note-as-outdated';
import { getNoteDefinition } from './get-note';
import { getNoteChildrenDefinition } from './get-note-children';
import { listNotesDefinition } from './list-notes';
import { updateNoteDefinition } from './update-note';
import { updateNoteOwnerDefinition } from './update-note-owner';
import { verifyNoteDefinition } from './verify-note';

/**
 * Note management tool definitions
 */
export const noteTools: ToolDefinition<unknown>[] = [
  createNoteDefinition,
  listNotesDefinition,
  getNoteDefinition,
  deleteNoteDefinition,
  updateNoteDefinition,
  getNoteChildrenDefinition,
  verifyNoteDefinition,
  flagNoteAsOutdatedDefinition,
  archiveNoteDefinition,
  updateNoteOwnerDefinition,
];
