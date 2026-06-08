import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateVariantDto {
    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    stock_quantity?: number;
}
