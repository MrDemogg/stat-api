import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
    configurationSchema,
    type Configuration,
} from './config/configuration.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthCookiesKeys } from './auth/common/auth-cookies.keys.js';
import { PrismaExceptionsFilter } from './database/Prisma/prisma-exceptions.filter.js';

async function bootstrap() {
    const env: Configuration = configurationSchema.parse(process.env);
    
    const app = await NestFactory.create(AppModule,
        {
            cookies: {
                secret: env.COOKIES_SECRET
            },
            cors: {
                origin: env.FRONTEND_URL,
                credentials: true
            }
        }
    );
    app.use(cookieParser(env.COOKIES_SECRET))

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
    }))
    app.useGlobalFilters(new PrismaExceptionsFilter())

    const config = new DocumentBuilder()
        .setTitle('StatApi')
        .setVersion('1.0')
        .addCookieAuth(AuthCookiesKeys.refreshTokenKey)
        .addCookieAuth(AuthCookiesKeys.accessTokenKey)
        .build();
        
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(env.PORT);

    console.log(`Started on: ${env.PORT}`);
}
await bootstrap();
