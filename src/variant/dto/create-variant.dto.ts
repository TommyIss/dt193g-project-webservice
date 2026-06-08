import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateVariantDto {

    @Transform(({ value }) => {
        if (value === undefined || value === null || String(value).trim() === '' || value === 'null' || value === 'undefined') {
            return 'One Size';
        }
        return String(value);
    })
    @IsString({ message: 'Storlek måste vara en sträng' })
    // Ta bort ! och tillåt att den kan initieras eller transformeras
    size!: string;


    @Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
    @IsNumber({}, { message: 'Pris måste vara ett nummer' })
    @IsNotEmpty({ message: 'Priset måste anges' })
    @Min(0, { message: 'Priset kan inte vara negativt' })
    price!: number;

    @Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
    @IsNumber({}, { message: 'Lagersaldo måste vara ett nummer' })
    @IsNotEmpty({ message: 'Lagersaldo måste anges' })
    @Min(0, { message: 'Lagersaldo kan inte vara negativt' })
    stock_quantity!: number;

    @IsOptional()
    @Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
    @IsNumber({}, { message: 'ProduktId måste vara ett nummer' })
    productId!: number;
}