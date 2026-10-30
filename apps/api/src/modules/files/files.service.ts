import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { CreateFileDto } from './dto/create-file.dto';
import { and, eq, isNull } from 'drizzle-orm';

@Injectable()
export class FilesService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getFiles(folderId?: string) {
    const query = this.db.select().from(schema.files);

    if (folderId) {
      return query.where(
        and(
          eq(schema.files.folderId, folderId),
          eq(schema.files.deleted, false),
        ),
      );
    }

    return query.where(
      and(isNull(schema.files.folderId), eq(schema.files.deleted, false)),
    );
  }

  async createFile(fileDto: CreateFileDto) {
    const folderId = fileDto.folderId ?? null;

    if (folderId) {
      const [folder] = await this.db
        .select({ id: schema.folders.id })
        .from(schema.folders)
        .where(eq(schema.folders.id, folderId));

      if (!folder) {
        throw new NotFoundException(`Folder ${folderId} does not exist`);
      }
    }

    const [file] = await this.db
      .insert(schema.files)
      .values({
        name: fileDto.name,
        contentType: fileDto.contentType,
        size: fileDto.size,
        folderId,
      })
      .returning();

    return file;
  }

  async deleteFile(fileId: string) {
    const [deletedFile] = await this.db
      .update(schema.files)
      .set({ deleted: true })
      .where(eq(schema.files.id, fileId))
      .returning();

    if (!deletedFile) {
      throw new NotFoundException(`File ${fileId} does not exist`);
    }

    return deletedFile;
  }
}
