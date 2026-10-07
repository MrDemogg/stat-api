import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ProjectAccessGuard } from './guards/project-access.guard.js';

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService, ProjectAccessGuard],
    imports: [DatabaseModule, AuthModule],
    exports: [ProjectAccessGuard],
})
export class ProjectsModule {}
