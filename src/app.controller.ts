import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
    @ApiOperation({
        summary: "Checks server's life",
    })
    @Get('alive')
    alive() {
        return true;
    }
}
