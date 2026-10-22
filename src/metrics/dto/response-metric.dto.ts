import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateMetricDto } from "./create-metric.dto.js";
import { ResponseMetricPointDto } from "../../metric-points/dto/response-metric-point.dto.js";

export class ResponseMetricDto extends CreateMetricDto { 
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly ingestKey: string;

    @IsDefined()
    declare readonly description: string;
}