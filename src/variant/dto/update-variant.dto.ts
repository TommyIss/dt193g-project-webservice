import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateVariantDto {
    @IsOptional()
    @IsNumber()
    id?: number;
    @IsOptional()
    @Transform(({ value }) => value?.trim() === '' ? 'One Size': value)
    @IsString()
    size?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Pris Måste vara ett nummer'})
    @IsNotEmpty({ message: 'Priset måste anges'})
    price?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Lagersaldo måste vara ett nummer'})
    @IsNotEmpty({ message: 'Lagersaldo'})
    stock_quantity?: number;

    @IsOptional()
    @IsNumber({}, { message: 'ProduktId måste vara ett nummer'})
    @IsNotEmpty({ message: 'ProduktId får inte vara tomt'})
    productId?: number;
}