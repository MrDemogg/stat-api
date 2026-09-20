export const RedisKeys = {
    userRefreshTokens: (userId: number) => `user:${userId}:refresh`
}