import { Module } from "@nestjs/common";
import { MetricPointsService } from "./metric-points.service.js";
import { MetricPointsController } from "./metric-points.controller.js";
import { MetricPointsIngestController } from "./metric-points.ingest.controller.js";
import { DatabaseModule } from "../database/database.module.js";
import { AuthModule } from "../auth/auth.module.js";
import { ProjectsModule } from "../projects/projects.module.js";

@Module({
    providers: [MetricPointsService],
    controllers: [MetricPointsController, MetricPointsIngestController],
    imports: [DatabaseModule, AuthModule, ProjectsModule]
})
export class MetricPointsModule {}