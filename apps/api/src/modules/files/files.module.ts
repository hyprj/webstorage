import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../db/drizzle.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [DrizzleModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
