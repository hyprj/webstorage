import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../db/drizzle.module';
import { FoldersModule } from '../folders/folders.module';
import { FilesController } from './files.controller';
import { DrizzleFilesRepository, FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [DrizzleModule, FoldersModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    { provide: FilesRepository, useClass: DrizzleFilesRepository },
  ],
})
export class FilesModule {}
