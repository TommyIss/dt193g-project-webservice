import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested} from "class-validator";
import { CreateVariantDto } from "src/variant/dto/create-variant.dto";

export class CreateProductDto {
    @IsString({ message: 'Productnamn måste anges'})
    @IsNotEmpty({ message: 'Product får inte vara tomt'})
    name!: string;

    @IsString({ message: 'Beskrivning måste anges'})
    @IsNotEmpty({ message: 'Beskrivning får inte vara tomt'})
    description!: string;

    @IsNumber({}, { message: 'Kategory måste anges'})
    @IsNotEmpty({ message: 'Kategori får inte vara tomt'})
    categoryId!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants!: CreateVariantDto[];
}