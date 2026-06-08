import { Type, Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional } from "class-validator";
import { CreateVariantDto } from "src/variant/dto/create-variant.dto";

export class CreateProductDto {
    @IsString({ message: 'Produktnamn måste vara en textsträng!' })
    @IsNotEmpty({ message: 'Produktnamn får inte vara tomt!' })
    name!: string;

    @IsString({ message: 'Beskrivning måste vara en textsträng!' })
    @IsNotEmpty({ message: 'Beskrivning får inte vara tomt!' })
    description!: string;

    @Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
    @IsNumber({}, { message: 'Kategori-ID måste vara ett nummer!' })
    @IsNotEmpty({ message: 'Kategori får inte vara tomt!' })
    categoryId!: number;

    @Transform(({ value }) => {
        if (!value || value === '') return [];
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return []; 
            }
        }
        return value;
    })
    @Type(() => CreateVariantDto)
    variants!: CreateVariantDto[];
}