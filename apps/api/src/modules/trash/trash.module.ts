import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../db/drizzle.module';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

@Module({
  imports: [DrizzleModule],
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
