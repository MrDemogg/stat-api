import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { ResponseMetricDto } from './dto/response-metric.dto.js';
import { UpdateMetricDto } from './dto/update-metric.dto.js';
import { CreateMetricDto } from './dto/create-metric.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { PrismaUtils } from '../database/Prisma/prisma.utils.js';
import { Prisma } from '../generated/prisma/client.js';

export class MetricsService {
    constructor(private prismaService: PrismaService) {}

    async findAll(
        projectId: number,
        from?: number,
        to?: number,
    ): Promise<ResponseMetricDto[]> {
        return await this.prismaService.metric.findMany({
            where: {
                projectId: projectId,
            },
            omit: {
                projectId: true,
            },
            skip: from,
            take: to,
        });
    }

    async update(projectId: number, id: number, newInfo: UpdateMetricDto) {
        if (Object.values(newInfo).length === 0 || Object.values(newInfo).every((value) => value === undefined)) {
            throw new BadRequestException(
                'At least one metric parameter in the body must be changed and not undefined',
            );
        }

        await this.prismaService.metric.update({
            where: {
                id,
                projectId,
            },
            data: newInfo,
        });
    }

    async create(projectId: number, info: CreateMetricDto) {
        const maxAttempts = 5; // не знаю стоит ли это куда-то выносить для внешней настройки

        // uuidv4 конечно генерирует ключи, которые маловероятно повторяться, но так намного больше гарантий
        // цикл for как компромисс между отсутствием повторных попыток и циклом while true
        for (let att = 0; att < maxAttempts; att++) {
            const ingestKey = uuidv4();

            try {
                await this.prismaService.metric.create({
                    data: {
                        title: info.title,
                        description: info.description,
                        ingestKey: ingestKey,
                        project: {
                            connect: {
                                id: projectId
                            }
                        }
                    },
                });
                return;
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
                    if (!target.includes('title')) {
                        continue;
                    }
                }

                throw e;
            }
        }
    }

    async remove(projectId: number, metricId: number) {
        await this.prismaService.metric.delete({
            where: {
                id: metricId,
                projectId: projectId,
            },
        });
    }
}
