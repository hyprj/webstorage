import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../db/drizzle.provider';
import { File, Folder } from '../../db/schema';
import * as schema from '../../db/schema';

export type TrashItems = { files: File[]; folders: Folder[] };

export abstract class TrashRepository {
  abstract findDeleted(folderId: string | null): Promise<TrashItems>;
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
}
