import { drizzle } from 'drizzle-orm/postgres-js';
import { Provider } from '@nestjs/common';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE_CONNECTION';

export const drizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: () => {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/webstorage';

    const client = postgres(connectionString);
    return drizzle(client, { schema });
  },
};
