import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMetricDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description?: string;
}
