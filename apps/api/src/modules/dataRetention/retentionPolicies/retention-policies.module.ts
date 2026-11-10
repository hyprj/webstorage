import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../../db/drizzle.module';
import { RetentionPoliciesController } from './retention-policies.controller';
import {
  RetentionPoliciesRepository,
  DrizzleRetentionPoliciesRepository,
} from './retention-policies.repository';
import { RetentionPoliciesService } from './retention-policies.service';

@Module({
  imports: [DrizzleModule],
  controllers: [RetentionPoliciesController],
  providers: [
    RetentionPoliciesService,
    {
      provide: RetentionPoliciesRepository,
      useClass: DrizzleRetentionPoliciesRepository,
    },
  ],
  exports: [RetentionPoliciesService],
})
export class RetentionPoliciesModule {}
