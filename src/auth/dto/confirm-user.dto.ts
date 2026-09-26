import { IsUUID } from "class-validator";

export class ConfirmUserDto { 
    @IsUUID(4)
    readonly regReqId: string
}