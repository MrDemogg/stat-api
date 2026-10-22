import {
    CanActivate,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface.js';
import { Request } from 'express';
import { PrismaService } from '../../database/Prisma/prisma.service.js';
import { ReuqestUtils } from '../../common/utils/request.utils.js';
import { RouteParams } from '../../common/constants/route-params.constants.js';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
    constructor(private prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const userId = request.userId;
        if (!userId) throw new UnauthorizedException('User not authorized');

        const projectIdParam = ReuqestUtils.getSingleParam(
            request,
            RouteParams.projectId,
        );
        if (!projectIdParam)
            throw new InternalServerErrorException(
                'No projectId found in params',
            );

        const project = await this.prismaService.project.findUnique({
            where: {
                ownerId: userId,
                id: parseInt(projectIdParam),
            },
        });

        if (project) return true;

        throw new ForbiddenException('No acces to this project');
    }
}
