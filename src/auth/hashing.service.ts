import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import crypto from 'node:crypto';
import { TypedConfigService } from '../config/typedConfig.service.js';

@Injectable()
export class HashingService {
    constructor(private config: TypedConfigService) {}

    async hardHash(data: string): Promise<string> {
        return await argon2.hash(data);
    }

    async hardCompare(data: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, data);
    }

    fastHash(data: string): string {
        return crypto
            .createHmac('sha256', this.config.get('HASH_SECRET'))
            .update(data)
            .digest('hex');
    }

    fastCompare(data: string, hash: string): boolean {
        return this.fastHash(data) == hash;
    }
}
