import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { ResponseMetricPointDto } from './dto/response-metric-point.dto.js';

export class MetricPointsService {
    constructor(private prismaService: PrismaService) {}

    async findMany(
        projectId: number,
        metricId: number,
        from: Date,
        to: Date,
    ): Promise<ResponseMetricPointDto[]> {
        const parsedPoints: ResponseMetricPointDto[] = []

        const points = await this.prismaService.metricPoint.findMany({
            where: {
                metricId,
                metric: { projectId },
                date: {
                    lte: to,
                    gte: from,
                },
            },
        });

        points.forEach((point) => parsedPoints.push({
            ...point,
            [point.data]: JSON.parse(point.data)
        }));

        return parsedPoints;
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

    async create(ingestKey: string, pointInfo: unknown) {
        await this.prismaService.metricPoint.create({
            data: {
                data: JSON.stringify(pointInfo),
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
