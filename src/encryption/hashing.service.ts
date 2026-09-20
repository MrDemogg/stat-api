import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt"

@Injectable()
export class HashingService { 
    async hashData(data: string) { 
        const saltOrRounds = 10;
        return bcrypt.hash(data, saltOrRounds);
    }

    async compare(data: string, encrypted: string) { 
        return bcrypt.compare(data,encrypted)
    }
}