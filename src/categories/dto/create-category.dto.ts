import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'Kategori måste vara en text!' })
    @IsNotEmpty({ message: 'Kategori måste anges!'})
    name!: string;
}