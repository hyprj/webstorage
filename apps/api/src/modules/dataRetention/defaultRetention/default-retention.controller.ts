import { Controller } from '@nestjs/common';
import { DefaultRetentionService } from './default-retention.service';

@Controller('data-retention/default')
export class DefaultRetentionController {
  constructor(private readonly service: DefaultRetentionService) {}

  // TODO: Add endpoints that call the service.
}
