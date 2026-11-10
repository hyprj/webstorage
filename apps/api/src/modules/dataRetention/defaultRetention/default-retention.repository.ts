import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../../db/drizzle.provider';
import * as schema from '../../../db/schema';

export abstract class DefaultRetentionRepository {
  // TODO: Declare abstract methods for database operations.
}

@Injectable()
export class DrizzleDefaultRetentionRepository implements DefaultRetentionRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  // TODO: Implement the repository methods using Drizzle.
}
