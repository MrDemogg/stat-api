import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class MetricsRangeQuery { 
    @ApiPropertyOptional({
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly from?: number 

    @ApiPropertyOptional({
        example: 5,
        minimum: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly to?: number
}