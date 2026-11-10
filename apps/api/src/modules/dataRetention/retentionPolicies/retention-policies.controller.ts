import { Controller } from '@nestjs/common';
import { RetentionPoliciesService } from './retention-policies.service';

@Controller('data-retention/policies')
export class RetentionPoliciesController {
  constructor(private readonly service: RetentionPoliciesService) {}

  // TODO: Add endpoints that call the service.
}
