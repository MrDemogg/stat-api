import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";

export const CurrentUserId = createParamDecorator((_, context): number => { 
    const req: Request = context.switchToHttp().getRequest()

    if (!req.userId) { 
        throw new InternalServerErrorException('No user id found in request')
    }

    return req.userId
})