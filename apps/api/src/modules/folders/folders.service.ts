import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { isNull } from 'drizzle-orm';

@Injectable()
export class FoldersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getFolders() {
    return this.db
      .select()
      .from(schema.folders)
      .where(isNull(schema.folders.parentId));
  }
}
