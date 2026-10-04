import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { ResponseMetricDto } from './dto/metric/response-metric.dto.js';
import { UpdateMetricDto } from './dto/metric/update-metric.dto.js';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace.js';
import { CreateMetricDto } from './dto/metric/create-metric.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { PrismaUtils } from '../database/Prisma/prisma.utils.js';
import { CreateMetricPointDto } from './dto/metric-point/create-metric-point.dto.js';

export class MetricsService {
    constructor(private prismaSerivce: PrismaService) {}

    async findAll(projectId: number): Promise<ResponseMetricDto[]> {
        return await this.prismaSerivce.metric.findMany({
            where: {
                projectId: projectId,
            },
            omit: {
                projectId: true,
            },
            include: {
                points: {
                    omit: {
                        metricId: true,
                    },
                },
            },
        });
    }

    async update(projectId: number, id: number, newInfo: UpdateMetricDto) {
        try {
            await this.prismaSerivce.metric.update({
                where: {
                    id: id,
                    projectId: projectId,
                },
                data: {
                    title: newInfo.title,
                    description: newInfo.description,
                },
            });
        } catch (e) {
            if (PrismaUtils.isPrismaNotFoundError(e)) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    async create(projectId: number, info: CreateMetricDto) {
        while (true) {
            const ingestKey = uuidv4();

            try {
                return await this.prismaSerivce.metric.create({
                    data: {
                        title: info.title,
                        description: info.title,
                        ingestKey: ingestKey,
                        projectId: projectId,
                    },
                });
            } catch (e) {
                if (PrismaUtils.isPrismaUniqueConstraintError(e)) {
                    continue;
                }

                throw e;
            }
        }
    }

    async remove(projectId: number, metricId: number) {
        try {
            await this.prismaSerivce.metric.delete({
                where: {
                    id: metricId,
                    projectId: projectId,
                },
            });
        } catch (e) { 
            if (PrismaUtils.isPrismaNotFoundError(e)) { 
                throw new NotFoundException();
            }

            throw e
        }
    }

    async removePoint(projectId: number, metricId: number, pointId: number) { 
        try { 
            await this.prismaSerivce.metricPoint.delete({
                where: {
                    id: pointId,
                    metric: {
                        id: metricId,
                        projectId: projectId
                    }
                }
            })
        } catch (e)
        {
            if (PrismaUtils.isPrismaNotFoundError(e)) { 
                throw new NotFoundException()
            }

            throw e
        }
    }

    async pushPoint(ingestKey: string, pointInfo: CreateMetricPointDto) { 
        await this.prismaSerivce.metricPoint.create({
            data: {
                data: pointInfo.data,
                date: new Date(),
                metric: {
                    connect: {
                        ingestKey: ingestKey
                    }
                }
            }
        })
    }
}
