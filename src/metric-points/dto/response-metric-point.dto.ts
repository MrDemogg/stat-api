import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseMetricPointDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty({
        description: "Date in UTC!"
    })
    @IsNotEmpty()
    @IsDate()
    readonly date: Date;

    @IsNotEmpty()
    @IsString()
    readonly data: any;
}