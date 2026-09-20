import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtExpiresIn, JwtPayload } from "./jwt.types";

@Injectable()
export class TokenService {
    constructor(private jwt: JwtService) { }
    
    async getAccessToken(userId: number) {
        return await this.jwt.signAsync(
            { userId } as JwtPayload,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFETIME as JwtExpiresIn
            }
        );
    }

    async getRefreshToken(userId: number) { 
        return await this.jwt.signAsync(
            { userId } as JwtPayload,
            {
                expiresIn: process.env.REFRESH_TOKEN_LIFETIME as JwtExpiresIn
            }
        );
    }

    async verifyAsync(token: string) { 
        try {
            const payload: JwtPayload = await this.jwt.verifyAsync(token);
            return payload
        } catch { 
            throw new UnauthorizedException("Token is invalid")
        }
    }
}