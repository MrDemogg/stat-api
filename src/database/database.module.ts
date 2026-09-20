import { Module } from "@nestjs/common";
import { PrismaService } from "./Prisma/prisma.service";
import { RedisService } from "./Redis/redis.service";

@Module({
    providers: [PrismaService, RedisService],
    exports: [PrismaService, RedisService]
})
export class DatabaseModule {}