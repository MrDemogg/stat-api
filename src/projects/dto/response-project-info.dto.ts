import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProjectDto } from './create-project.dto.js';

export class ResponseProjectInfoDto extends CreateProjectDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsDefined()
    declare readonly description: string;
}
