import { IsNotEmpty, IsString } from "class-validator";

export class ProjectInfoDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
};
