import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("projects/:project/metrics")
export class MetricsController { 
    @Get()
    async findAll() { 
        
    }

    @Patch(":metric")
    async update() { 
        
    }

    @Post()
    async create() { 

    }

    @Delete(":metric")
    async remove() { 

    }
}