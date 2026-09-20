import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service';
import { RedisService } from '../database/Redis/redis.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { HashingService } from '../encryption/hashing.service';
import { TokenService } from '../encryption/token.service';
import { RedisKeys } from '../database/Redis/redis.keys';
import { User } from '../../generated/prisma/client';
import { RefreshUserDto } from './dto/refresh-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private redis: RedisService, private tokenService: TokenService, private hashing: HashingService) {}

    async login(authUserDto: AuthUserDto) { 
        const user = await this.prisma.user.findUnique({
            where: {
                username: authUserDto.username
            }
        })

        if (!user) throw new NotFoundException("User not found");

        const passMatch = this.hashing.compare(authUserDto.password, user.passwordHash);

        if (!passMatch) throw new ForbiddenException("Invalid username or password")

        const accessToken = await this.tokenService.getAccessToken(user.id);
        const refreshToken = await this.createSession(user);

        return {accessToken, refreshToken}
    }

    async registration(createUserDto: CreateUserDto) { 
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: createUserDto.username
                    },
                    {
                        email: createUserDto.email
                    }
                ]
            }
        });

        if (user) throw new ConflictException("User with this username or email already exists");

        await this.prisma.user.create({
            data: {
                email: 
            }
        })
    }

    async refresh(refreshUserDto: RefreshUserDto) {
        const tokenPayload = await this.tokenService.verifyAsync(refreshUserDto.refreshToken);
        const tokens = await this.redis.client.LRANGE(RedisKeys.userRefreshTokens(tokenPayload.userId), 0, -1);

        if (tokens.length == 0) throw new NotFoundException("User sessions not found");

        const tokenHash = await this.hashing.hashData(refreshUserDto.refreshToken);

        if (tokens.includes(tokenHash)) {
            const accessToken = await this.tokenService.getAccessToken(tokenPayload.userId);
            return accessToken;
        }

        throw new UnauthorizedException("Token is invalid")
    }

    private async createSession(user: User) { 
        const refetchTokenKey = RedisKeys.userRefreshTokens(user.id);

        const tokens = await this.redis.client.LRANGE(refetchTokenKey, 0, -1);
        const maxTokensPerUser = Number(process.env.MAX_TOKENS_PER_USER);

        if (tokens.length == maxTokensPerUser) await this.redis.client.lPop(refetchTokenKey)

        const refreshToken = await this.tokenService.getRefreshToken(user.id);
        const tokenHash = await this.hashing.hashData(refreshToken);

        await this.redis.client.rPush(refetchTokenKey, tokenHash);

        return refreshToken;
    }
}
