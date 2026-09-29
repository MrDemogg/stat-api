import { IsNotEmpty, IsString } from "class-validator";

export class MetricInfoDto { 
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string
}