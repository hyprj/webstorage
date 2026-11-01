import { Inject, Injectable } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../db/drizzle.provider';
import * as schema from '../../db/schema';
import { Folder, NewFolder } from '../../db/schema';

export abstract class FoldersRepository {
  abstract findChildren(parentId?: string | null): Promise<Folder[]>;
  abstract findById(id: string): Promise<Folder | undefined>;
  abstract create(
    folder: Pick<NewFolder, 'name' | 'parentId'>,
  ): Promise<Folder | undefined>;
  abstract deleteById(id: string): Promise<{ id: string } | undefined>;
}

@Injectable()
export class DrizzleFoldersRepository implements FoldersRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findChildren(parentId?: string | null): Promise<Folder[]> {
    const query = this.db.select().from(schema.folders);

    if (parentId) {
      return query.where(eq(schema.folders.parentId, parentId));
    }

    return query.where(isNull(schema.folders.parentId));
  }

  async findById(id: string): Promise<Folder | undefined> {
    const [folder] = await this.db
      .select()
      .from(schema.folders)
      .where(eq(schema.folders.id, id));

    return folder;
  }

  async create(
    folder: Pick<NewFolder, 'name' | 'parentId'>,
  ): Promise<Folder | undefined> {
    const [createdFolder] = await this.db
      .insert(schema.folders)
      .values(folder)
      .returning();

    return createdFolder;
  }

  async deleteById(id: string): Promise<{ id: string } | undefined> {
    const [deletedFolder] = await this.db
      .delete(schema.folders)
      .where(eq(schema.folders.id, id))
      .returning({ id: schema.folders.id });

    return deletedFolder;
  }
}
