import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthUserDto { 
    @IsString()
    @IsNotEmpty()
    readonly username: string

    @IsString()
    @MinLength(6)
    readonly password: string
}