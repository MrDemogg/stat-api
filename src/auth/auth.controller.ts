import {
    Body,
    Controller,
    CookieSerializeOptions,
    Get,
    Post,
    Res,
    SignedCookies,
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto.js';
import { AuthService } from './auth.service.js';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthCookiesKeys } from './common/auth-cookies.keys.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ConfirmUserDto } from './dto/confirm-user.dto.js';
import { AuthTokens } from './common/auth-tokents.type.js';
import { TypedConfigService } from '../config/typedConfig.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private adapterHost: HttpAdapterHost,
        private config: TypedConfigService,
    ) {}

    readonly authCookiesOptions: CookieSerializeOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    };

    @Post('logout')
    async logout(
        @SignedCookies(AuthCookiesKeys.refreshTokenKey) refreshToken: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(refreshToken);
        this.adapterHost.httpAdapter.clearCookie(res, AuthCookiesKeys.refreshTokenKey);
        this.adapterHost.httpAdapter.clearCookie(res, AuthCookiesKeys.accessTokenKey);
    }

    @Post('login')
    async login(
        @Body() authUserDto: AuthUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.setAuthTokens(res, await this.authService.login(authUserDto));
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        await this.authService.registrationRequest(createUserDto);
    }

    @Post('confirm')
    async confirm(
        @Body() confirmUserDto: ConfirmUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.setAuthTokens(
            res,
            await this.authService.registrationConfirm(confirmUserDto),
        );
    }

    @Get('refresh')
    async refresh(
        @Res({ passthrough: true }) res: Response,
        @SignedCookies(AuthCookiesKeys.refreshTokenKey) refreshToken: string,
    ) {
        this.setAuthTokens(res, {
            accessToken: await this.authService.refresh(refreshToken),
            refreshToken: refreshToken,
        });
    }

    private setAuthTokens(res: Response, authTokens: AuthTokens) {
        this.adapterHost.httpAdapter.setCookie(
            res,
            AuthCookiesKeys.accessTokenKey,
            authTokens.accessToken,
            {
                ...this.authCookiesOptions,
                maxAge: this.config.get('ACCESS_TOKEN_LIFETIME') * 1000,
            },
        );

        this.adapterHost.httpAdapter.setCookie(
            res,
            AuthCookiesKeys.refreshTokenKey,
            authTokens.refreshToken,
            {
                ...this.authCookiesOptions,
                maxAge: this.config.get('REFRESH_TOKEN_LIFETIME') * 1000,
            },
        );
    }
}
