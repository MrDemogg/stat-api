import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { CreateMetricPointDto } from "./create-metric-point.dto.js";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseMetricPointDto extends CreateMetricPointDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty({
        description: "Date in UTC!"
    })
    @IsNotEmpty()
    @IsDate()
    readonly date: Date;
}