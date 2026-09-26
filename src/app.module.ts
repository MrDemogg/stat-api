import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module.js';
import { TypedConfigModule } from './config/typedConfig.module.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { AppController } from './app.controller.js';

@Module({
    controllers: [AppController],
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.example.com',
                port: 587,
                auth: {
                    user: 'username',
                    pass: 'password',
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                adapter: new HandlebarsAdapter(),
                dir: join(process.cwd(), 'mailer-templates'),
                options: { strict: true },
            },
        }),
        TypedConfigModule,
        AuthModule,
    ],
})
export class AppModule {}
