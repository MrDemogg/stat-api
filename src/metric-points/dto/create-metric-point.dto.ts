import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsOptional, ValidateNested } from "class-validator";

class MetricPointCustomization { 
    @IsOptional()
    @IsNumber()
    readonly y?: number;
}

export class CreateMetricPointDto { 
    @IsOptional()
    @ValidateNested()
    @Type(() => MetricPointCustomization)
    readonly customization?: MetricPointCustomization

    @IsOptional()
    readonly data?: unknown;
}