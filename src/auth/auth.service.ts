import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/Prisma/prisma.service.js';
import { RedisService } from '../database/Redis/redis.service.js';
import { AuthUserDto } from './dto/auth-user.dto.js';
import { TokenService } from './token.service.js';
import { RedisKeys } from '../database/Redis/redis.keys.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { TypedConfigService } from '../config/typedConfig.service.js';
import { HashingService } from './hashing.service.js';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmUserDto } from './dto/confirm-user.dto.js';
import { AuthTokens } from './common/auth-tokents.type.js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
        private tokenService: TokenService,
        private config: TypedConfigService,
        private hashing: HashingService,
        private mailer: MailerService
    ) {}

    async login(authUserDto: AuthUserDto): Promise<AuthTokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: authUserDto.username,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        const passMatch = await this.hashing.hardCompare(
            authUserDto.password,
            user.passwordHash,
        );

        if (!passMatch)
            throw new ForbiddenException('Invalid username or password');

        const accessToken = await this.tokenService.getAccessToken(user.id);
        const refreshToken = await this.createSession(user.id);

        return { accessToken, refreshToken };
    }

    async logout(refreshToken: string) { 
        const tokenPayload = await this.tokenService.verifyToken(refreshToken);
        this.redis.client.lRem(RedisKeys.userRefreshTokens(tokenPayload.userId), 1, refreshToken);
    }

    async registrationRequest(createUserDto: CreateUserDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: createUserDto.username,
                    },
                    {
                        email: createUserDto.email,
                    },
                ],
            },
        });

        if (user)
            throw new ConflictException(
                'User with this username or email already exists',
            );

        const regId = uuidv4();

        const confirmLink = this.config.get("REGISTRATION_CONFIRM_FRONTEND_URL") + regId;

        try {
            await this.mailer.sendMail({
                to: createUserDto.email,
                subject: 'Registration confirmation',
                template: 'regConfirm',
                context: {
                    username: createUserDto.username,
                    confirmLink
                },
            });
        } catch (e) { 
            console.error("Mailer may not be set properly:")
            console.error(e)
            console.log(confirmLink);
        }

        const regRequest: CreateUserDto = {
            ...createUserDto,
            password: await this.hashing.hardHash(createUserDto.password),
        };

        await this.redis.client.set(
            RedisKeys.registrationRequest(regId),
            JSON.stringify(regRequest),
            {
                expiration: {
                    type: 'EX',
                    value: this.config.get('REGISTRATION_TTL_SECONDS'),
                },
            },
        );
    }

    async registrationConfirm(
        confirmUserDto: ConfirmUserDto,
    ): Promise<AuthTokens> {
        const regReqKey = RedisKeys.registrationRequest(
            confirmUserDto.regReqId,
        );
        const regJsonData = await this.redis.client.get(regReqKey);

        if (!regJsonData)
            throw new NotFoundException(
                'Registration request with this id is not found',
            );

        await this.redis.client.del(regReqKey);

        const regData: CreateUserDto = JSON.parse(regJsonData);

        const user = await this.prisma.user.create({
            data: {
                email: regData.email,
                passwordHash: regData.password,
                username: regData.username,
            },
        });

        const accessToken = await this.tokenService.getAccessToken(user.id);
        const refreshToken = await this.createSession(user.id);

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string): Promise<string> {
        const tokenPayload = await this.tokenService.verifyToken(refreshToken)
        return await this.tokenService.getAccessToken(tokenPayload.userId);
    }

    private async createSession(userId: number): Promise<string> {
        const redisRefetchTokenKey = RedisKeys.userRefreshTokens(userId);

        const tokens = await this.redis.client.LRANGE(
            redisRefetchTokenKey,
            0,
            -1,
        );
        const maxTokensPerUser = this.config.get('MAX_TOKENS_PER_USER');

        if (tokens.length == maxTokensPerUser)
            await this.redis.client.lPop(redisRefetchTokenKey);

        const refreshToken = await this.tokenService.getRefreshToken(userId);
        const tokenHash = this.hashing.fastHash(refreshToken);

        await this.redis.client.rPush(redisRefetchTokenKey, tokenHash);

        return refreshToken;
    }
}
