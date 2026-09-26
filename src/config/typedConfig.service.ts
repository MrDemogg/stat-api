// typed-config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './configuration.js';

@Injectable()
export class TypedConfigService {
    constructor(private readonly config: ConfigService) {}

    get<T extends keyof Configuration>(key: T): Configuration[T] {
        return this.config.getOrThrow(key) as Configuration[T];
    }
}
