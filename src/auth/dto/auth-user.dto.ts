import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ResponseUserDto } from './response-user.dto.js';

export class AuthUserDto {
    @IsString()
    readonly password: string;
    
    @IsNotEmpty()
    @IsString()
    readonly username: string;
}
