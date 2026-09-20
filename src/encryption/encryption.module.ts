import { Module } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";

@Module(
    {
        providers: [HashingService, TokenService],
        exports: [HashingService, TokenService],
        imports: [
            JwtModule.register({
                secret: process.env.JWT_SECRET
            })
        ]
    }
)
export class EncryptionModule {}