import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
    configurationSchema,
    type Configuration,
} from './config/configuration.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const env: Configuration = configurationSchema.parse(process.env);
    
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser(env.COOKIES_SECRET))

    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }))

    const config = new DocumentBuilder()
        .setTitle('StatApi')
        .setDescription('StatApi API description')
        .setVersion('1.0')
        .addTag('42')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(env.PORT);

    console.log(`Started on: ${env.PORT}`);
}
await bootstrap();
