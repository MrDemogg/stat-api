import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class MetricPointsRangeQuery {
    @ApiProperty({
        example: 'YYYY-MM-DDTHH:mm:ss.sssZ',
        description: "Date in UTC!"
    })
    @Type(() => Date)
    @IsDate()
    readonly from: Date;

    @ApiProperty({
        example: 'YYYY-MM-DDTHH:mm:ss.sssZ',
        description: "Date in UTC!"
    })
    @Type(() => Date)
    @IsDate()
    readonly to: Date;
}