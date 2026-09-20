import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { EncryptionModule } from '../encryption/encryption.module.js';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        DatabaseModule,
        EncryptionModule
    ]
})
export class AuthModule {}
