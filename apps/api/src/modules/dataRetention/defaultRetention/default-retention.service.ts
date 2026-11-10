import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DefaultRetention } from '../../../db/schema';
import { DefaultRetentionRepository } from './default-retention.repository';

@Injectable()
export class DefaultRetentionService {
  constructor(private readonly repository: DefaultRetentionRepository) {}

  async getDefaultRetention(): Promise<DefaultRetention> {
    const defaultRetention = await this.repository.getDefault();

    if (!defaultRetention) {
      throw new InternalServerErrorException(
        'Default retention is not configured',
      );
    }

    return defaultRetention;
  }
}
