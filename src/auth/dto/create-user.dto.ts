import { AuthUserDto } from "./auth-user.dto";

export class CreateUserDto extends AuthUserDto { 
    readonly email: string
}