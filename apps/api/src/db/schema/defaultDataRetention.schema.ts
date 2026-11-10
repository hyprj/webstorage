import { sql } from 'drizzle-orm';
import { check, integer, pgTable } from 'drizzle-orm/pg-core';

import { retentionPeriods } from '../../modules/dataRetention/defaultRetention/retention-policy';

export const defaultRetention = pgTable(
  'defaultDataRetention',
  {
    id: integer('id').primaryKey().default(1),
    periodSeconds: integer('period_seconds'),
  },
  (table) => [
    check('default_retention_singleton', sql`${table.id} = 1`),
    check(
      'default_retention_allowed_period',
      sql`${table.periodSeconds} IS NULL OR ${table.periodSeconds} IN (${sql.raw(
        Object.values(retentionPeriods).join(', '),
      )})`,
    ),
  ],
);

export type DefaultRetention = typeof defaultRetention.$inferSelect;
export type NewDefaultRetention = typeof defaultRetention.$inferInsert;
