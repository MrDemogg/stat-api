import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UpdateMetricDto } from "./update-metric.dto.js";
import { ResponseMetricPointDto } from "../metric-point/response-metric-point.dto.js";

export class ResponseMetricDto extends UpdateMetricDto { 
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly ingestKey: string;

    @IsArray()
    readonly points: ResponseMetricPointDto[];
}