import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { ResponseMetricDto } from './dto/metric/response-metric.dto.js';
import { UpdateMetricDto } from './dto/metric/update-metric.dto.js';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace.js';
import { CreateMetricDto } from './dto/metric/create-metric.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { PrismaUtils } from '../database/Prisma/prisma.utils.js';
import { CreateMetricPointDto } from './dto/metric-point/create-metric-point.dto.js';
import { Prisma } from '../generated/prisma/client.js';

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
        if (!newInfo.title && !newInfo.description) { 
            throw new BadRequestException("Body must have title or description")
        }

        try {
            await this.prismaSerivce.metric.update({
                where: {
                    id: id,
                    projectId: projectId,
                },
                data: newInfo,
            });
        } catch (e) {
            if (PrismaUtils.isPrismaNotFoundError(e)) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    async create(projectId: number, info: CreateMetricDto) {
        const maxAttempts = 5; // не знаю стоит ли это куда-то выносить для внешней настройки

        // uuidv4 конечно генерирует ключи, которые маловероятно повторяться, но так намного больше гарантий
        // цикл for как компромисс между отсутствием повторных попыток и циклом while true
        for (let att = 0; att < maxAttempts; att++) {
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
                // нельзя допустить чтобы цикл продолжался из-за ошибки об уникальности при условии, 
                // что причиной ошибки является title
                if (
                    e instanceof Prisma.PrismaClientKnownRequestError &&
                    PrismaUtils.isPrismaUniqueConstraintError(e) &&
                    e.meta &&
                    'target' in e.meta &&
                    Array.isArray(e.meta['target'])
                ) {
                    const target: string[] = e.meta['target'];
                    if (target.includes('title')) {
                        throw new ConflictException(
                            'Metric with this title already exists',
                        );
                    }

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

            throw e;
        }
    }

    async removePoint(projectId: number, metricId: number, pointId: number) {
        try {
            await this.prismaSerivce.metricPoint.delete({
                where: {
                    id: pointId,
                    metric: {
                        id: metricId,
                        projectId: projectId,
                    },
                },
            });
        } catch (e) {
            if (PrismaUtils.isPrismaNotFoundError(e)) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    async pushPoint(ingestKey: string, pointInfo: CreateMetricPointDto) {
        // Проверки на ошибку об уникальности date решил не делать
        // Date генерируется в реальном времени прям тут при запросе
        await this.prismaSerivce.metricPoint.create({
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
