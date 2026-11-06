import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import * as schema from './../src/db/schema.js';
import { AppModule } from './../src/app.module.js';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let folderId: string;
  let fileId: string;
  const client = postgres(
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/webstorage',
  );
  const db = drizzle(client, { schema });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(Array.isArray(body.folders)).toBe(true);
      });
  });

  it('deletes and restores a file through the trash API', async () => {
    const folderResponse = await request(app.getHttpServer())
      .post('/folders')
      .send({ name: `e2e-${Date.now()}`, parentId: null })
      .expect(201);
    folderId = folderResponse.body.id;

    const fileResponse = await request(app.getHttpServer())
      .post('/files')
      .send({
        name: `e2e-${Date.now()}.txt`,
        contentType: 'text/plain',
        size: 1,
        folderId,
      })
      .expect(201);
    fileId = fileResponse.body.id;

    await request(app.getHttpServer()).delete(`/files/${fileId}`).expect(200);

    await request(app.getHttpServer())
      .get('/trash')
      .expect(200)
      .expect(({ body }) => {
        expect(body.files.some((file: { id: string }) => file.id === fileId)).toBe(
          true,
        );
      });

    await request(app.getHttpServer())
      .patch(`/trash/files/${fileId}/restore`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/files?folderId=${folderId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.some((file: { id: string }) => file.id === fileId)).toBe(
          true,
        );
      });
  });

  afterEach(async () => {
    await app.close();
    if (fileId) {
      await db.delete(schema.files).where(eq(schema.files.id, fileId));
    }
    if (folderId) {
      await db.delete(schema.folders).where(eq(schema.folders.id, folderId));
    }
  });

  afterAll(async () => {
    await client.end();
  });
});
