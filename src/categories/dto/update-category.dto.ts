import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString({ message: 'Kategori måste vara en text!' })
    @IsNotEmpty({ message: 'Kategori måste anges!'})
    name?: string;
}