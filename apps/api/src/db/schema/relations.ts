import { relations } from 'drizzle-orm';

import { files } from './files.schema';
import { folders } from './folders.schema';

export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folder_to_folder',
  }),
  children: many(folders, { relationName: 'folder_to_folder' }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));
