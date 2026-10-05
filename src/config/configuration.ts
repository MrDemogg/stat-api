import { z } from "zod";

// export type JwtLifetime = `${number}${'s' | 'm' | 'h' | 'd'}`

// const jwtLifetime = z.string()
//     .regex(/^\d+[smhd]$/, "Use a duration such as 5m or 30d")
//     .transform(val => val as JwtLifetime);

export const configurationSchema = z.object({
    DEV_MODE: z.coerce.boolean().default(false),
    //urls
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().startsWith('redis://'),
    REGISTRATION_CONFIRM_FRONTEND_URL: z.url().endsWith('/'),
    PORT: z.coerce.number().int().positive().default(3000),
    //secrets
    JWT_SECRET: z.string().min(32),
    COOKIES_SECRET: z.string().min(32),
    HASH_SECRET: z.string().min(32),
    //other
    ACCESS_TOKEN_LIFETIME: z.coerce.number(), // jwtLifetime.default("5m"),
    REFRESH_TOKEN_LIFETIME: z.coerce.number(), // jwtLifetime.default("30d"),
    MAX_TOKENS_PER_USER: z.coerce.number().int().positive().default(5),
    REGISTRATION_TTL_SECONDS: z.coerce.number().int().min(60),
});

export type Configuration = z.infer<typeof configurationSchema>;

export default (env: Record<string, unknown>): Configuration => configurationSchema.parse(env);