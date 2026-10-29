import { PartialType } from '@nestjs/swagger';
import { CreateMetricDto } from './create-metric.dto.js';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { MetricRenderModes } from '../../generated/prisma/enums.js';

export class UpdateMetricDto extends PartialType(CreateMetricDto) {
    @IsOptional()
    @IsString()
    @IsIn(Object.keys(MetricRenderModes))
    readonly renderMode?: MetricRenderModes
}
