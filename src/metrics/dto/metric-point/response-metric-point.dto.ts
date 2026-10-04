import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { CreateMetricPointDto } from "./create-metric-point.dto.js";

export class ResponseMetricPointDto extends CreateMetricPointDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
    
    @IsNotEmpty()
    @IsDate()
    readonly date: Date;
}