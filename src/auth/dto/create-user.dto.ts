import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { AuthUserDto } from './auth-user.dto.js';

export class CreateUserDto extends AuthUserDto {
    @IsEmail()
    readonly email: string;

    @MinLength(6)
    declare readonly password: string;

    @MaxLength(20)
    declare readonly username: string;
}
