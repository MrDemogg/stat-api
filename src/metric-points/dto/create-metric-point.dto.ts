import { IsNotEmpty, IsString } from "class-validator";

export class CreateMetricPointDto { 
    @IsString()
    @IsNotEmpty()
    readonly data: string;
}