const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const postgres = require('postgres');

async function seed() {
  const client = postgres(
    process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/webstorage',
    { max: 1, connect_timeout: 5 },
  );

  try {
    const sql = readFileSync(
      join(__dirname, 'seeds', 'default-retention.sql'),
      'utf8',
    );
    await client.unsafe(sql);
    console.log('Default retention initialized; existing settings preserved.');
  } finally {
    await client.end({ timeout: 5 });
  }
}

seed().catch((error) => {
  if (error.code === '42P01') {
    console.error('Default retention table is missing. Run db:push first.');
  } else {
    console.error('Database seed failed:', error.code || error.message);
  }
  process.exitCode = 1;
});
