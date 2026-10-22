import {
    Controller,
    Delete,
    Get,
    ParseDatePipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { ProjectAccessGuard } from '../projects/guards/project-access.guard.js';
import {
    ApiCookieAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AuthCookiesKeys } from '../auth/common/auth-cookies.keys.js';
import { RouteParams } from '../common/constants/route-params.constants.js';
import { IntParam } from '../common/decorators/int-param.decorator.js';
import { MetricPointsService } from './metric-points.service.js';
import { ResponseMetricPointDto } from './dto/response-metric-point.dto.js';
import { MetricPointsRangeQuery } from './queries/metric-points-range.query.js';

@Controller(`projects/:${RouteParams.projectId}/metrics`)
@ApiCookieAuth(AuthCookiesKeys.accessTokenKey)
@UseGuards(AuthGuard, ProjectAccessGuard)
export class MetricPointsController {
    constructor(private metricPointsService: MetricPointsService) {}

    @Delete(`:${RouteParams.metricId}/:${RouteParams.metricPointId}`)
    @ApiOkResponse({
        description: "Metric's point removed",
    })
    @ApiNotFoundResponse()
    async remove(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
        @IntParam(RouteParams.metricPointId) metricPointId: number,
    ) {
        await this.metricPointsService.remove(
            projectId,
            metricId,
            metricPointId,
        );
    }

    @Get(`:${RouteParams.metricId}`)
    @ApiOkResponse({
        description: 'Array of metric points',
        type: [ResponseMetricPointDto],
    })
    @ApiNotFoundResponse()
    async findMany(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
        @Query() query: MetricPointsRangeQuery
    ): Promise<ResponseMetricPointDto[]> {
        return await this.metricPointsService.findMany(
            projectId,
            metricId,
            query.from,
            query.to
        );
    }
}
