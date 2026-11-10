import { IsDefined, IsIn, ValidateIf } from 'class-validator';
import { retentionPeriods } from '../retention-policy';
import type { DEFAULT_RETENTION_PERIOD } from '../retention-policy';

export class UpdateDefaultRetentionDto {
  @ValidateIf((_, value) => value !== null)
  @IsDefined()
  @IsIn(Object.values(retentionPeriods))
  periodSeconds!: DEFAULT_RETENTION_PERIOD;
}
