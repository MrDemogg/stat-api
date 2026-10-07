import { NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

export const PrismaUtils = {
    isPrismaNotFoundError: (e: any) =>
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025',
    isPrismaUniqueConstraintError: (e: any) =>
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002',
};
