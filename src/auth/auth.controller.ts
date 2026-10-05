import {
    Body,
    Controller,
    CookieSerializeOptions,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Res,
    SignedCookies,
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto.js';
import { AuthService } from './auth.service.js';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthCookiesKeys } from './common/auth-cookies.keys.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { AuthTokens } from './common/types/auth-tokens.type.js';
import { TypedConfigService } from '../config/typedConfig.service.js';
import {
    ApiConflictResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiDefaultResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RouteParams } from '../common/constants/route-params.js';

@Controller('auth')
export class AuthController {
    private readonly authCookiesOptions: CookieSerializeOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        signed: true,
    };

    constructor(
        private authService: AuthService,
        private adapterHost: HttpAdapterHost,
        private config: TypedConfigService,
    ) {
        if (config.get('DEV_MODE')) {
            this.authCookiesOptions.secure = false;
            this.authCookiesOptions.sameSite = undefined;
        }
    }

    @Post('register')
    @ApiCreatedResponse({
        description: 'Registration request created and confirmation link sent',
    })
    @ApiConflictResponse({
        description: 'User with this username or email already exists',
    })
    async register(@Body() createUserDto: CreateUserDto) {
        await this.authService.registrationRequest(createUserDto);
    }

    @Post(`confirm/:${RouteParams.regReqId}`)
    @ApiCreatedResponse({
        description: 'Account confirmed and created',
    })
    @ApiNotFoundResponse({
        description: 'Registration request not found',
    })
    async confirm(
        @Param(RouteParams.regReqId) regRegId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.setAuthTokens(
            res,
            await this.authService.registrationConfirm(regRegId),
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Authorizatrion success',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    @ApiForbiddenResponse({
        description: 'Username or password invalid',
    })
    async login(
        @Body() authUserDto: AuthUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.setAuthTokens(res, await this.authService.login(authUserDto));
    }

    @Get('refresh')
    @ApiOkResponse({
        description: 'Access token refreshed',
    })
    @ApiUnauthorizedResponse({
        description: 'Refresh token invalid',
    })
    @ApiCookieAuth(AuthCookiesKeys.refreshTokenKey)
    async refresh(
        @Res({ passthrough: true }) res: Response,
        @SignedCookies(AuthCookiesKeys.refreshTokenKey) refreshToken: string,
    ) {
        this.setAuthTokens(res, {
            accessToken: await this.authService.refresh(refreshToken),
            refreshToken: refreshToken,
        });
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Logged out"
    })
    @ApiUnauthorizedResponse({
        description: 'Refresh token invalid',
    })
    @ApiCookieAuth(AuthCookiesKeys.refreshTokenKey)
    async logout(
        @SignedCookies(AuthCookiesKeys.refreshTokenKey) refreshToken: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(refreshToken);
        this.adapterHost.httpAdapter.clearCookie(
            res,
            AuthCookiesKeys.refreshTokenKey,
        );
        this.adapterHost.httpAdapter.clearCookie(
            res,
            AuthCookiesKeys.accessTokenKey,
        );
    }

    private setAuthTokens(res: Response, authTokens: AuthTokens) {
        this.adapterHost.httpAdapter.setCookie(
            res,
            AuthCookiesKeys.accessTokenKey,
            authTokens.accessToken,
            {
                ...this.authCookiesOptions,
                maxAge: this.config.get('ACCESS_TOKEN_LIFETIME'),
            },
        );

        this.adapterHost.httpAdapter.setCookie(
            res,
            AuthCookiesKeys.refreshTokenKey,
            authTokens.refreshToken,
            {
                ...this.authCookiesOptions,
                maxAge: this.config.get('REFRESH_TOKEN_LIFETIME'),
            },
        );
    }
}
