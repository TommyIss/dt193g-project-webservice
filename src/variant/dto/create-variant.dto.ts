import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVariantDto {
    @Transform(({ value }) => value?.trim() === '' ? 'One Size': value)
    @IsString({ message: 'Storlek måste vara sträng'})
    size!: string;

    @IsNumber({}, { message: 'Pris måste vara ett nummer' })
    @IsNotEmpty({ message: 'Priset måste anges'})
    price!: number;

    @IsNumber({}, { message: 'Lagersaldo måste vara ett nummer' })
    stock_quantity!: number;

    @IsOptional()
    @IsNumber({}, { message: 'ProduktId måste vara ett nummer'})
    productId!: number;
}