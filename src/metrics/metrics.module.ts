import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.base.controller.js';
import { MetricsIngestController } from './metrics.ingest.controller.js';
import { MetricsService } from './metrics.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ProjectsModule } from '../projects/projects.module.js';

@Module({
    controllers: [MetricsController, MetricsIngestController],
    providers: [MetricsService],
    imports: [DatabaseModule, AuthModule, ProjectsModule],
})
export class MetricsModule {}
