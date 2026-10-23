import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { DrizzleModule } from '../../db/drizzle.module';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService],
  imports: [DrizzleModule],
})
export class FoldersModule {}
