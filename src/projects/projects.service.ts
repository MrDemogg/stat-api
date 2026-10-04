import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { ResponseProjectDto } from './dto/response-project.dto.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { PrismaUtils } from '../database/Prisma/prisma.utils.js';

@Injectable()
export class ProjectsService {
    constructor(private prismaSerive: PrismaService) {}

    async findAll(ownerId: number): Promise<ResponseProjectDto[]> {
        const projects = await this.prismaSerive.project.findMany({
            where: {
                ownerId: ownerId,
            },
            omit: {
                ownerId: true,
            },
        });

        return projects;
    }

    async update(
        ownerId: number,
        projectId: number,
        newProjectInfo: UpdateProjectDto,
    ) {
        try {
            await this.prismaSerive.project.update({
                where: {
                    ownerId: ownerId,
                    id: projectId,
                },
                data: {
                    title: newProjectInfo.title,
                    description: newProjectInfo.description,
                },
            });
        } catch (e) {
            if (PrismaUtils.isPrismaNotFoundError(e)) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    async create(ownerId: number, projectInfo: CreateProjectDto) {
        await this.prismaSerive.project.create({
            data: {
                ownerId: ownerId,
                title: projectInfo.title,
                description: projectInfo.description,
            },
        });
    }

    async remove(ownerId: number, projectId: number) {
        try {
            await this.prismaSerive.project.delete({
                where: {
                    ownerId: ownerId,
                    id: projectId,
                },
            });
        } catch (e) {
            if (PrismaUtils.isPrismaNotFoundError(e)) {
                throw new NotFoundException();
            }

            throw e;
        }
    }
}
