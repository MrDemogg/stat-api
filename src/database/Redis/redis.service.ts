import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy { 
    readonly client = createClient({
        url: process.env.REDIS_URL
    })

    async onModuleInit() { 
        this.client.connect();
    }

    async onModuleDestroy() { 
        this.client.quit();
    }
}