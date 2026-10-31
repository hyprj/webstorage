import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { Folder, File } from '../../db/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { DRIZZLE } from '../../db/drizzle.provider';
import { and, eq, isNull } from 'drizzle-orm';

@Injectable()
export class TrashService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getTrash(
    folderId: string | null,
  ): Promise<{ files: File[]; folders: Folder[] }> {
    // get from files and folders all where deleted = true//
    // expanding folders on the ui can use standard folders module i believe?
    // folders deleted flag is not yet implemented;

    if (folderId) {
      const folders = await this.db
        .select()
        .from(schema.folders)
        .where(
          and(
            eq(schema.folders.id, folderId),
            eq(schema.folders.deleted, true),
          ),
        );

      const files = await this.db
        .select()
        .from(schema.files)
        .where(
          and(eq(schema.files.id, folderId), eq(schema.files.deleted, true)),
        );

      return { folders, files };
    }

    const folders = await this.db
      .select()
      .from(schema.folders)
      .where(and(isNull(schema.folders.id), eq(schema.folders.deleted, true)));

    const files = await this.db
      .select()
      .from(schema.files)
      .where(and(isNull(schema.files.id), eq(schema.files.deleted, true)));

    return { folders, files };
  }

  async restoreFile(_fileId: string): Promise<never> {
    // update 'deleted' column
    throw new NotImplementedException();
  }

  async restoreFolder(_folderId: string): Promise<never> {
    // update 'deleted' column
    throw new NotImplementedException();
  }

  async permanentlyDeleteFile(_fileId: string): Promise<never> {
    // this will be implemented as 'purge file' later on
    throw new NotImplementedException();
  }

  async permanentlyDeleteFolder(_folderId: string): Promise<never> {
    // this will be implemented as 'purge folder' later on
    throw new NotImplementedException();
  }
}
