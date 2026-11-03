import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as schema from '../../db/schema';
import { DrizzleTrashRepository } from './trash.repository';

describe('DrizzleTrashRepository (integration)', () => {
  const client = postgres(
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/webstorage',
  );
  const db = drizzle(client, { schema });
  const repository = new DrizzleTrashRepository(db);
  let folderId: string;
  let fileId: string;

  beforeAll(async () => {
    const [folder] = await db
      .insert(schema.folders)
      .values({ name: `integration-${Date.now()}`, deleted: true })
      .returning();
    folderId = folder.id;

    const [file] = await db
      .insert(schema.files)
      .values({
        name: `integration-${Date.now()}`,
        contentType: 'text/plain',
        size: 1,
        folderId,
        deleted: true,
        originalLocation: 'Projects',
      })
      .returning();
    fileId = file.id;
  });

  afterAll(async () => {
    await db.delete(schema.files).where(eq(schema.files.id, fileId));
    await db.delete(schema.folders).where(eq(schema.folders.id, folderId));
    await client.end();
  });

  it('finds deleted files and folders', async () => {
    const trash = await repository.findDeleted(null);

    expect(trash.files.some((file) => file.id === fileId)).toBe(true);
    expect(trash.folders.some((folder) => folder.id === folderId)).toBe(true);
  });

  it('restores a deleted file and folder', async () => {
    const restoredFolder = await repository.restoreFolder(folderId, null);
    const restoredFile = await repository.restoreFile(fileId, null);

    expect(restoredFolder?.deleted).toBe(false);
    expect(restoredFile?.deleted).toBe(false);
    expect(restoredFile?.folderId).toBeNull();
  });
});
