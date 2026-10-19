import { PrismaService } from '../database/Prisma/prisma.service.js';
import { CreateMetricPointDto } from './dto/create-metric-point.dto.js';
import { ResponseMetricPointDto } from './dto/response-metric-point.dto.js';

export class MetricPointsService {
    constructor(private prismaService: PrismaService) {}

    async findMany(
        projectId: number,
        metricId: number,
        from: Date,
        to: Date, 
    ): Promise<ResponseMetricPointDto[]> {
        return await this.prismaService.metricPoint.findMany({
            where: {
                metricId,
                metric: { projectId },
                date: {
                    lte: to,
                    gte: from
                }
            },
        });
    }

    async remove(projectId: number, metricId: number, pointId: number) {
        await this.prismaService.metricPoint.delete({
            where: {
                id: pointId,
                metric: {
                    id: metricId,
                    projectId: projectId,
                },
            },
        });
    }

    async create(ingestKey: string, pointInfo: CreateMetricPointDto) {
        await this.prismaService.metricPoint.create({
            data: {
                data: pointInfo.data,
                date: new Date(),
                metric: {
                    connect: {
                        ingestKey: ingestKey,
                    },
                },
            },
        });
    }
}
