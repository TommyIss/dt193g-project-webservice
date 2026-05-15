import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


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
}