import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
    configurationSchema,
    type Configuration,
} from './config/configuration.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const env: Configuration = configurationSchema.parse(process.env);

    const app = await NestFactory.create(AppModule, {
        cookies: {
            secret: env.COOKIES_SECRET,
        },
    });

    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }))

    await app.listen(env.PORT);

    console.log(`Started on: ${env.PORT}`);
}
await bootstrap();
