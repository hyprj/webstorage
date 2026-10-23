import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq, isNull } from 'drizzle-orm';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getFolders(parentId?: string | null) {
    const query = this.db.select().from(schema.folders);

    if (parentId) {
      return query.where(eq(schema.folders.parentId, parentId));
    }

    return query.where(isNull(schema.folders.parentId));
  }

  async getFolderById(id: string) {
    const [folder] = await this.db
      .select()
      .from(schema.folders)
      .where(eq(schema.folders.id, id));

    if (!folder) {
      throw new NotFoundException(`No folder with id ${id} exist`);
    }
  }

  async createFolder(dto: CreateFolderDto) {
    if (dto.parentId) {
      const [parent] = await this.db
        .select({ id: schema.folders.id })
        .from(schema.folders)
        .where(eq(schema.folders.id, dto.parentId));

      if (!parent) {
        throw new NotFoundException(`${dto.parentId} does not exist`);
      }
    }
    // array of created rows
    const [newFolder] = await this.db
      .insert(schema.folders)
      .values({ name: dto.name, parentId: dto.parentId })
      .returning();

    return newFolder;
  }
}
