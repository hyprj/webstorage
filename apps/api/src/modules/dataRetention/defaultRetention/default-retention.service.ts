import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { DefaultRetention } from '../../../db/schema';
import { DefaultRetentionRepository } from './default-retention.repository';
import { DEFAULT_RETENTION_PERIOD, retentionPeriods } from './retention-policy';

@Injectable()
export class DefaultRetentionService {
  constructor(private readonly repository: DefaultRetentionRepository) {}

  async getDefaultRetention(): Promise<DefaultRetention> {
    const defaultRetention = await this.repository.getDefault();

    if (!defaultRetention) {
      throw new InternalServerErrorException(
        'Default retention period is not configured',
      );
    }

    return defaultRetention;
  }

  async updateDefaultRetention(
    periodSeconds: DEFAULT_RETENTION_PERIOD,
  ): Promise<DefaultRetention> {
    if (
      periodSeconds !== null &&
      !Object.values(retentionPeriods).some(
        (period) => period === periodSeconds,
      )
    ) {
      throw new BadRequestException(
        `${periodSeconds} doesn't match expected value`,
      );
    }

    const defaultPeriod = await this.repository.updateDefault(periodSeconds);

    if (!defaultPeriod) {
      throw new InternalServerErrorException(
        'Default retention is not configured',
      );
    }

    return defaultPeriod;
  }

  async canPermanentlyDeleteEntry(entryDeletedAt: Date) {
    const retentionPeriod = await this.repository.getDefault();

    if (!retentionPeriod) {
      throw new InternalServerErrorException(
        'Default retention period is not configured',
      );
    }

    if (!retentionPeriod.periodSeconds) {
      return true;
    }

    return (
      entryDeletedAt.getTime() + retentionPeriod.periodSeconds * 1000 <=
      Date.now()
    );
  }
}
