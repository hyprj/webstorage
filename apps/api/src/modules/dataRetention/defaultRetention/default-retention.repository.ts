import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../../db/drizzle.provider';
import * as schema from '../../../db/schema';
import type { DefaultRetention } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export abstract class DefaultRetentionRepository {
  abstract getDefault(): Promise<DefaultRetention | undefined>;
}

@Injectable()
export class DrizzleDefaultRetentionRepository implements DefaultRetentionRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getDefault(): Promise<DefaultRetention | undefined> {
    const [defaultPeriod] = await this.db
      .select()
      .from(schema.defaultRetention)
      .where(eq(schema.defaultRetention.id, 1));

    return defaultPeriod;
  }
}
