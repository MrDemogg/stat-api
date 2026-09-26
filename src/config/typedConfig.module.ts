import { Global, Module } from '@nestjs/common';
import { TypedConfigService } from './typedConfig.service.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration.js';

@Global()
@Module({
    providers: [TypedConfigService],
    imports: [
        ConfigModule.forRoot({
            validate: configuration,
        }),
    ],
    exports: [TypedConfigService],
})
export class TypedConfigModule {}
