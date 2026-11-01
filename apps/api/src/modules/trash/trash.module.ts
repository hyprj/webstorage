import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../db/drizzle.module';
import { TrashController } from './trash.controller';
import { DrizzleTrashRepository, TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';

@Module({
  imports: [DrizzleModule],
  controllers: [TrashController],
  providers: [
    TrashService,
    { provide: TrashRepository, useClass: DrizzleTrashRepository },
  ],
})
export class TrashModule {}
