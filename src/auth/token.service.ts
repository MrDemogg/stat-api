import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypedConfigService } from '../config/typedConfig.service.js';
import { RedisService } from '../database/Redis/redis.service.js';
import { RedisKeys } from '../database/Redis/redis.keys.js';
import { HashingService } from './hashing.service.js';

export type TokenPayload = { userId: number };

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private typedConfig: TypedConfigService,
        private redis: RedisService,
        private hashing: HashingService,
    ) {}

    async getAccessToken(userId: number): Promise<string> {
        return await this.jwt.signAsync({ userId } as TokenPayload, {
            expiresIn: this.typedConfig.get('ACCESS_TOKEN_LIFETIME'),
        });
    }

    async getRefreshToken(userId: number): Promise<string> {
        return await this.jwt.signAsync({ userId } as TokenPayload, {
            expiresIn: this.typedConfig.get('REFRESH_TOKEN_LIFETIME'),
        });
    }

    async verifyRefreshToken(refreshToken: string): Promise<TokenPayload> {
        let payload: TokenPayload

        try {
            payload =
                await this.jwt.verifyAsync(refreshToken);
        } catch {
            throw new UnauthorizedException('Refresh token is invalid');
        }
        const tokensHashs = await this.redis.client.lRange(
            RedisKeys.userRefreshTokens(payload.userId),
            0,
            -1,
        );

        for (const tokenHash of tokensHashs) {
            if (this.hashing.fastCompare(refreshToken, tokenHash)) {
                return payload;
            }
        }

        throw new UnauthorizedException('Refresh token is invalid');
    }

    async verifyAccessToken(accessToken: string): Promise<TokenPayload> { 
        try {
            return await this.jwt.verifyAsync(accessToken);
        } catch { 
            throw new UnauthorizedException("Access token is invalid")
        }
    }
}
