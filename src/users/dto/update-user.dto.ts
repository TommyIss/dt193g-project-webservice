import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString({ message: 'Förnamn måste anges!' })
    @IsNotEmpty({ message: 'Förnamn får inte vara tomt!' })
    firstname?: string;

    @IsOptional()
    @IsString({ message: 'Efternamn måste anges!' })
    @IsNotEmpty({ message: 'Efternamn får inte vara tomt!' })
    lastname?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Ogiltig e-post!'})
    @IsNotEmpty({ message: 'E-post får inte vara tom!' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Lösenord måste anges!' })
    @IsNotEmpty({ message: 'Lösenord får inte vara tomt!' })
    @MinLength(6, { message: 'Lösenord måste vara minst 6 tecken!' })
    password?: string;

    @IsOptional()
    @IsString()
    role?: string;
}