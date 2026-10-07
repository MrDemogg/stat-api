import { IsString, MinLength } from 'class-validator';
import { ResponseUserDto } from './response-user.dto.js';

export class AuthUserDto extends ResponseUserDto {
    @IsString()
    @MinLength(6)
    readonly password: string;
}
