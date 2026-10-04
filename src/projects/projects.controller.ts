import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUserId } from '../auth/decorators/user-id.decorator.js';
import { RouteParams } from '../common/constants/route-params.js';
import { IntParam } from '../common/decorators/int-param.decorator.js';
import { ResponseProjectDto } from './dto/response-project.dto.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Controller('projects')
// Созданный рядом ProjectAccessGuard не используется здесь по той причине,
// что местный service при обращении к БД сразу проверяет одним запросом доступность
// мне нравится экономить количество обращений к БД
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get()
    async findAll(
        @CurrentUserId() userId: number,
    ): Promise<ResponseProjectDto[]> {
        return this.projectsService.findAll(userId);
    }

    @Patch(`:${RouteParams.projectId}`)
    async update(
        @CurrentUserId() userId: number,
        @IntParam(RouteParams.projectId) projectId: number,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        await this.projectsService.update(userId, projectId, updateProjectDto);
    }

    @Post()
    async create(
        @CurrentUserId() userId: number,
        @Body() createProjectDto: CreateProjectDto,
    ) {
        await this.projectsService.create(userId, createProjectDto);
    }

    @Delete(`:${RouteParams.projectId}`)
    async remove(
        @CurrentUserId() userId: number,
        @IntParam(RouteParams.projectId) projectId: number,
    ) {
        await this.projectsService.remove(userId, projectId);
    }
}
