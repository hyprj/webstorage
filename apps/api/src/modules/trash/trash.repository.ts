import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../db/drizzle.provider';
import { File, Folder } from '../../db/schema';
import * as schema from '../../db/schema';

export type TrashItems = { files: File[]; folders: Folder[] };

export abstract class TrashRepository {
  abstract findDeleted(folderId: string | null): Promise<TrashItems>;
  abstract findNonDeletedFile(fileId: string): Promise<File | undefined>;
  abstract deleteFile(
    fileId: string,
    originalLocation: string | null,
  ): Promise<File | undefined>;
  abstract findDeletedFile(fileId: string): Promise<File | undefined>;
  abstract restoreFile(
    fileId: string,
    folderId: string | null,
  ): Promise<File | undefined>;
  abstract findDeletedFolder(folderId: string): Promise<Folder | undefined>;
  abstract restoreFolder(
    folderId: string,
    parentId: string | null,
  ): Promise<Folder | undefined>;
  abstract permanentlyDeleteFile(fileId: string): Promise<void>;
  abstract permanentlyDeleteFolder(folderId: string): Promise<void>;
}

@Injectable()
export class DrizzleTrashRepository implements TrashRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findDeleted(folderId: string | null): Promise<TrashItems> {
    const deletedCondition =
      folderId === null
        ? eq(schema.files.deleted, true)
        : and(
            eq(schema.files.folderId, folderId),
            eq(schema.files.deleted, true),
          );
    const files = await this.db
      .select()
      .from(schema.files)
      .where(deletedCondition);
    const folders = await this.db
      .select()
      .from(schema.folders)
      .where(eq(schema.folders.deleted, true));

    return { files, folders };
  }

  async findNonDeletedFile(fileId: string): Promise<File | undefined> {
    const [file] = await this.db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, fileId), eq(schema.files.deleted, false)));

    return file;
  }

  async deleteFile(
    fileId: string,
    originalLocation: string | null,
  ): Promise<File | undefined> {
    const [deletedFile] = await this.db
      .update(schema.files)
      .set({ deleted: true, originalLocation })
      .where(eq(schema.files.id, fileId))
      .returning();

    return deletedFile;
  }

  async findDeletedFile(fileId: string): Promise<File | undefined> {
    const [file] = await this.db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, fileId), eq(schema.files.deleted, true)));

    return file;
  }

  async restoreFile(
    fileId: string,
    folderId: string | null,
  ): Promise<File | undefined> {
    const [restoredFile] = await this.db
      .update(schema.files)
      .set({ deleted: false, folderId })
      .where(and(eq(schema.files.id, fileId), eq(schema.files.deleted, true)))
      .returning();

    return restoredFile;
  }

  async findDeletedFolder(folderId: string): Promise<Folder | undefined> {
    const [folder] = await this.db
      .select()
      .from(schema.folders)
      .where(
        and(eq(schema.folders.id, folderId), eq(schema.folders.deleted, true)),
      );

    return folder;
  }

  async restoreFolder(
    folderId: string,
    parentId: string | null,
  ): Promise<Folder | undefined> {
    const [restoredFolder] = await this.db
      .update(schema.folders)
      .set({ deleted: false, parentId })
      .where(
        and(eq(schema.folders.id, folderId), eq(schema.folders.deleted, true)),
      )
      .returning();

    return restoredFolder;
  }

  async permanentlyDeleteFile(fileId: string): Promise<void> {
    await this.db
      .delete(schema.files)
      .where(and(eq(schema.files.id, fileId), eq(schema.files.deleted, true)));
  }

  async permanentlyDeleteFolder(folderId: string): Promise<void> {
    await this.db
      .delete(schema.folders)
      .where(
        and(eq(schema.folders.id, folderId), eq(schema.folders.deleted, true)),
      );
  }
}
