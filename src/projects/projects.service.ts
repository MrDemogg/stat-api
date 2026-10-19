import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ResponseProjectInfoDto } from './dto/response-project-info.dto.js';

@Injectable()
export class ProjectsService {
    constructor(private prismaSerive: PrismaService) {}

    async findAll(ownerId: number): Promise<ResponseProjectInfoDto[]> {
        const projects = await this.prismaSerive.project.findMany({
            where: {
                ownerId: ownerId,
            },
            omit: {
                ownerId: true,
            }
        });

        return projects;
    }

    async findOne(ownerId: number, projectId: number): Promise<ResponseProjectInfoDto> { 
        const project = await this.prismaSerive.project.findUnique({
            where: {
                ownerId,
                id: projectId,
            },
            omit: {
                ownerId: true
            }
        })

        if (!project) throw new NotFoundException("Project with this id not found")

        return project
    }

    async update(
        ownerId: number,
        projectId: number,
        newProjectInfo: UpdateProjectDto,
    ) {
        if (!newProjectInfo.title && !newProjectInfo.description) { 
            throw new BadRequestException("Body must have title or description")
        }

        await this.prismaSerive.project.update({
            where: {
                ownerId: ownerId,
                id: projectId,
            },
            data: newProjectInfo, // задаю newProjectInfo напрямую потому что поля называются одинаково и prisma пропустит незаданные поля
        });
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
        await this.prismaSerive.project.delete({
            where: {
                ownerId: ownerId,
                id: projectId,
            },
        });
    }
}
