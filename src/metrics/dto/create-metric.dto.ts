import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetricDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    readonly description: string;
}
