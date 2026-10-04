import { PartialType } from '@nestjs/swagger';
import { CreateMetricDto } from './create-metric.dto.js';

export class UpdateMetricDto extends PartialType(CreateMetricDto) {}
