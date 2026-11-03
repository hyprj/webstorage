import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
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
}

@Injectable()
export class DrizzleTrashRepository implements TrashRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findDeleted(folderId: string | null): Promise<TrashItems> {
    const files = await this.db
      .select()
      .from(schema.files)
      .where(
        and(
          folderId
            ? eq(schema.files.folderId, folderId)
            : isNull(schema.files.folderId),
          eq(schema.files.deleted, true),
        ),
      );

    return { files, folders: [] };
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
}
