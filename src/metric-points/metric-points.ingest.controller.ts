import { BadRequestException, Body, Controller, Param, Post, RawBody } from '@nestjs/common';
import { RouteParams } from '../common/constants/route-params.constants.js';
import { MetricPointsService } from './metric-points.service.js';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateMetricPointDto } from './dto/create-metric-point.dto.js';

@Controller('ingest/metrics')
export class MetricPointsIngestController {
    constructor(private metricPointsService: MetricPointsService) {}

    @Post(`:${RouteParams.metricIngest}`)
    @ApiOkResponse({
        description: 'Metric point added',
    })
    @ApiBadRequestResponse({
        description: 'Incorrect parametrs',
    })
    @ApiBody({
        description: 'Any data',
    })
    async create(
        @Param(RouteParams.metricIngest) ingestKey: string,
        @Body() createMetricPointDto: CreateMetricPointDto,
    ) {
        await this.metricPointsService.create(ingestKey, createMetricPointDto);
    }
}
