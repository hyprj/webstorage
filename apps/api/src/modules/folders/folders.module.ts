import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import {
  DrizzleFoldersRepository,
  FoldersRepository,
} from './folders.repository';
import { FoldersService } from './folders.service';
import { DrizzleModule } from '../../db/drizzle.module';

@Module({
  controllers: [FoldersController],
  providers: [
    FoldersService,
    { provide: FoldersRepository, useClass: DrizzleFoldersRepository },
  ],
  exports: [FoldersRepository],
  imports: [DrizzleModule],
})
export class FoldersModule {}
