import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../../../db/drizzle.provider';
import * as schema from '../../../db/schema';

export abstract class RetentionPoliciesRepository {
  // TODO: Declare abstract methods for database operations.
}

@Injectable()
export class DrizzleRetentionPoliciesRepository implements RetentionPoliciesRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  // TODO: Implement the repository methods using Drizzle.
}
