import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { TypedConfigService } from '../../config/typedConfig.service.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    readonly client;

    constructor(config: TypedConfigService) {
        this.client = createClient({
            url: config.get('REDIS_URL'),
        });
    }

    async onModuleInit() {
        this.client.connect();
    }

    async onModuleDestroy() {
        this.client.quit();
    }
}
