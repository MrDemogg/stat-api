import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService],
    imports: [DatabaseModule],
})
export class ProjectsModule {}
