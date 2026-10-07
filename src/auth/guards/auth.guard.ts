import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface.js';
import { AuthCookiesKeys } from '../common/auth-cookies.keys.js';
import { TokenService } from '../token.service.js';
import { Request } from 'express';
import { ReuqestUtils } from '../../common/utils/request.utils.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        
        const accessToken = ReuqestUtils.getSignedCookie(req, AuthCookiesKeys.accessTokenKey);

        if (accessToken) {
            const tokenPayload = await this.tokenService.verifyAccessToken(accessToken);

            req.userId = tokenPayload.userId

            return true;
        }

        throw new UnauthorizedException('User not authorized');
    }
}
