import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResponseUserDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly username: string;
}