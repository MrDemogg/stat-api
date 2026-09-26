import { IsEmail } from 'class-validator';
import { AuthUserDto } from './auth-user.dto.js';

export class CreateUserDto extends AuthUserDto {
    @IsEmail()
    readonly email: string;
}
