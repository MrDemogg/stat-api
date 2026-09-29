import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { ProjectInfoDto } from "./dto/project-info.dto.js";

@Controller("projects")
export class ProjectsController { 

    @Get()
    async findAll(): ProjectInfoDto[] { 

    }

    @Patch(":project")
    async update() { 
        
    }

    @Post()
    async create() { 

    }

    @Delete(":project")
    async remove() { 
        
    }
}