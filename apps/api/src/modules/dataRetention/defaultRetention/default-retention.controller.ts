import { Body, Controller, Get, Patch } from '@nestjs/common';
import { DefaultRetentionService } from './default-retention.service';
import type { DefaultRetention } from '../../../db/schema';
import { UpdateDefaultRetentionDto } from './dto/update-default-retention.dto';

@Controller('data-retention/default')
export class DefaultRetentionController {
  constructor(private readonly service: DefaultRetentionService) {}

  @Get()
  async getDefaultRetention(): Promise<DefaultRetention> {
    return this.service.getDefaultRetention();
  }

  @Patch()
  async updateDefaultRetention(
    @Body() dto: UpdateDefaultRetentionDto,
  ): Promise<DefaultRetention> {
    return this.service.updateDefaultRetention(dto.periodSeconds);
  }
}
