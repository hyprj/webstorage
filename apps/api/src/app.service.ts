import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from './db/drizzle.provider';
import * as schema from './db/schema';

@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: any,
  ) {}

  async getHello() {
    const allFolders = await this.db.select().from(schema.folders);
    return {
      status: 'ok',
      folders: allFolders,
    };
  }
}
