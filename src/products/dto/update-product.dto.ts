import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateVariantDto } from "src/variant/dto/update-variant.dto";


export class UpdateProductDto {
    @IsOptional()
    @IsString({ message: 'Produktnamn måste anges!' })
    @IsNotEmpty({ message: 'Produktnamn får inte vara tomt!'})
    name?: string;

    @IsOptional()
    @IsString({ message: 'Beskrivning måste anges'})
    @IsNotEmpty({ message: 'Beskrivning får inte vara tomt'})
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'category måste anges'})
    @IsNotEmpty({ message: 'Kategori får inte vara tomt'})
    categoryId?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateVariantDto)
    variants?: UpdateVariantDto[];
}