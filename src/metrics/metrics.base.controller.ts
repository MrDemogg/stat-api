import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { MetricsService } from './metrics.service.js';
import { RouteParams } from '../common/constants/route-params.js';
import { IntParam } from '../common/decorators/int-param.decorator.js';
import { ProjectAccessGuard } from '../projects/guards/project-access.guard.js';
import { UpdateMetricDto } from './dto/metric/update-metric.dto.js';
import { CreateMetricDto } from './dto/metric/create-metric.dto.js';

@Controller(`projects/:${RouteParams.projectId}/metrics`)
@UseGuards(AuthGuard, ProjectAccessGuard)
export class MetricsController {
    constructor(private metricsService: MetricsService) {}

    @Get()
    async findAll(
        @IntParam(RouteParams.projectId) projectId: number,
    ) {
        return await this.metricsService.findAll(projectId);
    }

    @Patch(`:${RouteParams.metricId}`)
    async update(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
        @Body() updateMetricDto : UpdateMetricDto
    ) {
        await this.metricsService.update(projectId, metricId, updateMetricDto);
    }

    @Post()
    async create(
        @IntParam(RouteParams.projectId) projectId: number,
        @Body() createMetricDto : CreateMetricDto
    ) {
        await this.metricsService.create(projectId, createMetricDto);
    }

    @Delete(`:${RouteParams.metricId}`)
    async remove(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number
    ) {
        await this.metricsService.remove(projectId, metricId);
    }

    @Delete(`:${RouteParams.metricId}/:${RouteParams.metricPointId}`)
    async removePoint(
        @IntParam(RouteParams.projectId) projectId: number,
        @IntParam(RouteParams.metricId) metricId: number,
        @IntParam(RouteParams.metricPointId) metricPointId: number
    ) { 
        await this.metricsService.removePoint(projectId, metricId, metricPointId);
    }
}
