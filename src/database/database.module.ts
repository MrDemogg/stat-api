import { Module } from '@nestjs/common';
import { PrismaService } from './Prisma/prisma.service.js';
import { RedisService } from './Redis/redis.service.js';
import { TypedConfigModule } from '../config/typedConfig.module.js';

@Module({
    providers: [PrismaService, RedisService],
    exports: [PrismaService, RedisService],
    imports: [TypedConfigModule],
})
export class DatabaseModule {}
