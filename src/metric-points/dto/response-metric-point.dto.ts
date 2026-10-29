import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateMetricPointDto } from "./create-metric-point.dto.js";

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