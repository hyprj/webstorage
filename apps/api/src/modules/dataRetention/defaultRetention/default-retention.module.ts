import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../../db/drizzle.module';
import { DefaultRetentionController } from './default-retention.controller';
import {
  DefaultRetentionRepository,
  DrizzleDefaultRetentionRepository,
} from './default-retention.repository';
import { DefaultRetentionService } from './default-retention.service';

@Module({
  imports: [DrizzleModule],
  controllers: [DefaultRetentionController],
  providers: [
    DefaultRetentionService,
    {
      provide: DefaultRetentionRepository,
      useClass: DrizzleDefaultRetentionRepository,
    },
  ],
  exports: [DefaultRetentionService],
})
export class DefaultRetentionModule {}
