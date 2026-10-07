import { Body, Controller, Param, Post } from '@nestjs/common';
import { RouteParams } from '../common/constants/route-params.js';
import { MetricsService } from './metrics.service.js';
import { CreateMetricPointDto } from './dto/metric-point/create-metric-point.dto.js';

@Controller('ingest/metrics')
export class MetricsIngestController {
    constructor(private metricsService: MetricsService) {}

    @Post(`:${RouteParams.metricIngest}`)
    async addPoint(
        @Param(RouteParams.metricIngest) ingestKey: string,
        @Body() createMetricPointDto: CreateMetricPointDto,
    ) {
        await this.metricsService.pushPoint(ingestKey, createMetricPointDto);
    }
}
