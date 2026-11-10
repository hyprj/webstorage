import { Controller, Get } from '@nestjs/common';
import { DefaultRetentionService } from './default-retention.service';
import type { DefaultRetention } from '../../../db/schema';

@Controller('data-retention/default')
export class DefaultRetentionController {
  constructor(private readonly service: DefaultRetentionService) {}

  @Get()
  async getDefaultRetention(): Promise<DefaultRetention> {
    return this.service.getDefaultRetention();
  }
}
