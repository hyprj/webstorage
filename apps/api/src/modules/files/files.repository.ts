import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../db/drizzle.provider';
import * as schema from '../../db/schema';
import { File, NewFile } from '../../db/schema';

export type CreateFileRecord = Pick<
  NewFile,
  'name' | 'contentType' | 'size' | 'folderId'
>;

export abstract class FilesRepository {
  abstract findAll(folderId?: string): Promise<File[]>;
  abstract findById(id: string): Promise<File | undefined>;
  abstract create(file: CreateFileRecord): Promise<File | undefined>;
  abstract markDeleted(
    id: string,
    originalLocation: string | null,
  ): Promise<File | undefined>;
}

@Injectable()
export class DrizzleFilesRepository implements FilesRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll(folderId?: string): Promise<File[]> {
    const query = this.db.select().from(schema.files);

    if (folderId) {
      return query.where(
        and(
          eq(schema.files.folderId, folderId),
          eq(schema.files.deleted, false),
        ),
      );
    }

    return query.where(
      and(isNull(schema.files.folderId), eq(schema.files.deleted, false)),
    );
  }

  async findById(id: string): Promise<File | undefined> {
    const [file] = await this.db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, id), eq(schema.files.deleted, false)));

    return file;
  }

  async create(file: CreateFileRecord): Promise<File | undefined> {
    const [createdFile] = await this.db
      .insert(schema.files)
      .values(file)
      .returning();

    return createdFile;
  }

  async markDeleted(
    id: string,
    originalLocation: string | null,
  ): Promise<File | undefined> {
    const [deletedFile] = await this.db
      .update(schema.files)
      .set({ deleted: true, originalLocation })
      .where(eq(schema.files.id, id))
      .returning();

    return deletedFile;
  }
}
