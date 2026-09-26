export const RedisKeys = {
    userRefreshTokens: (userId: number) => `user:${userId}:refresh`,
    registrationRequest: (id: string) => `registration:${id}`
}