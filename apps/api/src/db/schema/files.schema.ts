import {
  bigint,
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { folders } from './folders.schema';

export const files = pgTable(
  'files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    folderId: uuid('folder_id'),
    deleted: boolean('deleted').notNull().default(false),
    originalLocation: text('originalLocation'),
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

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
