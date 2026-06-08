import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'Kategorinamn måste vara en text!' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) 
    @IsNotEmpty({ message: 'Kategorinamn måste anges!' })
    name!: string;
}