import {
    Body,
    Controller,
    Delete,
    Get,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { MetricsService } from './metrics.service.js';
import { RouteParams } from '../common/constants/route-params.constants.js';
import { IntParam } from '../common/decorators/int-param.decorator.js';
import { ProjectAccessGuard } from '../projects/guards/project-access.guard.js';
import {
    ApiBadRequestResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AuthCookiesKeys } from '../auth/common/auth-cookies.keys.js';
import { ResponseMetricDto } from './dto/response-metric.dto.js';
import { UpdateMetricDto } from './dto/update-metric.dto.js';
import { CreateMetricDto } from './dto/create-metric.dto.js';
import { MetricsRangeQuery } from './queries/metrics-range.query.js';

@Controller(`projects/:${RouteParams.projectId}/metrics`)
@ApiCookieAuth(AuthCookiesKeys.accessTokenKey)
@UseGuards(AuthGuard, ProjectAccessGuard)
export class MetricsController {
    constructor(private metricsService: MetricsService) {}

    @Get()
    @ApiOkResponse({
        description: "Array of project's metrics",
        type: [ResponseMetricDto]
    })
    async findMany(
        @IntParam(RouteParams.projectId) projectId: number,
        @Query() query: MetricsRangeQuery
    ): Promise<ResponseMetricDto[]> {
        return await this.metricsService.findAll(projectId, query.to, query.from);
    }

    @Patch(`:${RouteParams.metricId}`)
    @ApiOkResponse({
        description: 'Metric update',
    })
    @ApiBadRequestResponse({
        description: 'Title and description are not setted',
    })
    @ApiNotFoundResponse()
    async update(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
        @Body() updateMetricDto: UpdateMetricDto,
    ) {
        await this.metricsService.update(projectId, metricId, updateMetricDto);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Metric created',
    })
    async create(
        @IntParam(RouteParams.projectId) projectId: number,
        @Body() createMetricDto: CreateMetricDto,
    ) {
        await this.metricsService.create(projectId, createMetricDto);
    }

    @Delete(`:${RouteParams.metricId}`)
    @ApiOkResponse({
        description: 'Metric removed',
    })
    @ApiNotFoundResponse()
    async remove(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
    ) {
        await this.metricsService.remove(projectId, metricId);
    }
}
