import { Injectable } from '@nestjs/common';
import { RetentionPoliciesRepository } from './retention-policies.repository';

@Injectable()
export class RetentionPoliciesService {
  constructor(private readonly repository: RetentionPoliciesRepository) {}

  // TODO: Add business operations that use the repository.
}
