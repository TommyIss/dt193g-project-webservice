import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVariantDto {
    @IsOptional()
    @IsString({ message: 'Storlek måste vara sträng'})
    size!: string;

    @IsNumber({}, { message: 'Pris måste vara ett nummer' })
    @IsNotEmpty({ message: 'Priset måste anges'})
    price!: number;

    @IsNumber({}, { message: 'Lagersaldo måste vara ett nummer' })
    stock_quantity!: number;

    @IsNumber({}, { message: 'ProduktId måste vara ett nummer'})
    @IsNotEmpty({ message: 'ProduktId får inte vara tomt'})
    productId!: number;
}