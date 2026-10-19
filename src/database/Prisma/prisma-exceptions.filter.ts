import { Catch, ConflictException, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client.js";
import { ArgumentsHost } from "@nestjs/common/interfaces/features/arguments-host.interface.js";
import { PrismaUtils } from "./prisma.utils.js";
import { Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        let nestError: HttpException;

        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();

        switch (exception.code) {
            case "P2002":
                nestError = new ConflictException(exception.message);
                break;
            case "P2025":
                nestError = new NotFoundException(exception.message);
                break;
            default:
                response.status(500).json({
                    statusCode: 500,
                    message: "Internal server error",
                })
                return;
        }

        response.status(nestError.getStatus()).json(nestError.getResponse())
    } 

}