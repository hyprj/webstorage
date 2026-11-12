import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../db/drizzle.module';
import { FoldersModule } from '../folders/folders.module';
import { TrashController } from './trash.controller';
import { DrizzleTrashRepository, TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';
import { DefaultRetentionModule } from '../dataRetention/defaultRetention/default-retention.module';

@Module({
  imports: [DrizzleModule, FoldersModule, DefaultRetentionModule],
  controllers: [TrashController],
  providers: [
    TrashService,
    { provide: TrashRepository, useClass: DrizzleTrashRepository },
  ],
})
export class TrashModule {}
