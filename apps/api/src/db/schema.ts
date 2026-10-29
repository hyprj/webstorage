import {
  pgTable,
  uuid,
  text,
  timestamp,
  foreignKey,
  bigint,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    parentId: uuid('parent_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'folders_parent_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const files = pgTable(
  'files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    folderId: uuid('folder_id'),
    contentType: text('content_type').notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.folderId],
      foreignColumns: [folders.id],
      name: 'files_folder_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folder_to_folder',
  }),
  children: many(folders, {
    relationName: 'folder_to_folder',
  }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
