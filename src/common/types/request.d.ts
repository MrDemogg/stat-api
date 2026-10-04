// Расширяю тип Request для кастомных параметров в request

import { User } from "../../generated/prisma/client.ts";

declare module 'express' { 
    interface Request { 
        userId?: number
    }
}