import { z } from "zod";

type JwtLifetime = `${number}${'s' | 'm' | 'h' | 'd'}`

export default z.object({
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(32),
    ACCESS_TOKEN_LIFETIME: z.custom<JwtLifetime>().default("5m"),
    REFRESH_TOKEN_LIFETIME: z.custom<JwtLifetime>().default("30d"),
    MAX_TOKENS_PER_USER: z.coerce.number().default(5)
})