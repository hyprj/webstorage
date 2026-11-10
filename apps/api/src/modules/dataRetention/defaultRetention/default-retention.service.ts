import { Injectable } from '@nestjs/common';
import { DefaultRetentionRepository } from './default-retention.repository';

@Injectable()
export class DefaultRetentionService {
  constructor(private readonly repository: DefaultRetentionRepository) {}

  // TODO: Add business operations that use the repository.
}
