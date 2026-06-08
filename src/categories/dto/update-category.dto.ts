import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString({ message: 'Kategorinamn måste vara en textsträng!' })
    @MinLength(1, { message: 'Kategorinamn får inte vara tomt!' })
    name?: string;
}