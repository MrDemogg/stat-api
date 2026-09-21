type JwtLifetime = `${number}${'s' | 'm' | 'h' | 'd'}`

export type AppConfig = { 
    port: number,
    database: {
        url: string
    },
    redis: {
        url: string
    },
    jwt: {
        secret: string,
        accessTokenLifeTime: JwtLifetime,
        refreshTokenLifeTime: JwtLifetime
    }
}

export default (): AppConfig => ({
    port: Number(process.env.PORT ?? 3000),
    database: {
        url: process.env.DATABASE_URL as string
    },
    redis: {
        url: process.env.REDIS_URL as string
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        accessTokenLifeTime: process.env.ACCESS_TOKEN_LIFETIME as JwtLifetime,
        refreshTokenLifeTime: process.env.REFRESH_TOKEN_LIFETIME as JwtLifetime
    }

})