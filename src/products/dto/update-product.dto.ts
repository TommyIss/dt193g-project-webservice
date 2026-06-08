import { Type, Transform } from "class-transformer";
import { IsOptional, IsString, IsNumber, IsArray, ValidateNested, MinLength } from "class-validator";
import { UpdateVariantDto } from "src/variant/dto/update-variant.dto";

export class UpdateProductDto {
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsString()
    @MinLength(1, { message: 'Produktnamn får inte vara tomt!' })
    name?: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsString()
    @MinLength(1, { message: 'Beskrivning får inte vara tomt!' })
    description?: string;

    @IsOptional()
    @Transform(({ value }) =>
        value === '' || value === null || value === undefined ? undefined : Number(value)
    )
    @IsNumber({}, { message: 'Kategori måste vara ett nummer!' })
    categoryId?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (!value || value === '') return undefined;

        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }

        return value;
    })
    variants?: any[];
}
