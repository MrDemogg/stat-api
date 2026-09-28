import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TokenService } from './token.service.js';
import { HashingService } from './hashing.service.js';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigModule } from '../config/typedConfig.module.js';
import { TypedConfigService } from '../config/typedConfig.service.js';

@Module({
    providers: [AuthService, TokenService, HashingService],
    controllers: [AuthController],
    imports: [
        JwtModule.registerAsync({
            imports: [TypedConfigModule],
            inject: [TypedConfigService],
            useFactory: (config: TypedConfigService) => ({
                secret: config.get("JWT_SECRET"),
                
            })
        }),
        TypedConfigModule,
        DatabaseModule,
    ]
})
export class AuthModule {}
