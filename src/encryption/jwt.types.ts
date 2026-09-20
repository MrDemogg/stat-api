export type JwtPayload = {userId: number}

export type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd'}`