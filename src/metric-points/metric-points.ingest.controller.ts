import { Body, Controller, Param, Post } from '@nestjs/common';
import { RouteParams } from '../common/constants/route-params.js';
import { MetricPointsService } from './metric-points.service.js';
import { CreateMetricPointDto } from './dto/create-metric-point.dto.js';

@Controller('ingest/metrics')
export class MetricPointsIngestController {
    constructor(private metricPointsService: MetricPointsService) {}

    @Post(`:${RouteParams.metricIngest}`)
    async create(
        @Param(RouteParams.metricIngest) ingestKey: string,
        @Body() createMetricPointDto: CreateMetricPointDto,
    ) {
        await this.metricPointsService.create(ingestKey, createMetricPointDto);
    }
}
