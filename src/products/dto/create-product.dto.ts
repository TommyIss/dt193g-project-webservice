import { IsNotEmpty, IsString, IsNumber} from "class-validator";

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
}