import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { TypedConfigService } from '../../config/typedConfig.service.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: TypedConfigService) {
        const adapter = new PrismaPg({
            connectionString: config.get('DATABASE_URL'),
        });

        super({ adapter });
    }
}
