import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {

    @Post()
    async login(@Body() authUserDto : AuthUserDto) { 
        
    }
}
