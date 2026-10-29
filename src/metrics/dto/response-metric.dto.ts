import { IsDefined, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateMetricDto } from "./create-metric.dto.js";
import { MetricRenderModes } from "../../generated/prisma/enums.js";

export class ResponseMetricDto extends CreateMetricDto { 
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly ingestKey: string;

    @IsDefined()
    declare readonly description: string;

    @IsString()
    @IsIn(Object.keys(MetricRenderModes))
    readonly renderMode: MetricRenderModes;
}