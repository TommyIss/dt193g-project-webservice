import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Förnamn måste anges!' })
    @IsNotEmpty({ message: 'Förnamn får inte vara tomt!' })
    firstname!: string;

    @IsString({ message: 'Efternamn måste anges!' })
    @IsNotEmpty({ message: 'Efternamn får inte vara tomt!' })
    lastname!: string;
    
    @IsEmail({}, { message: 'Ogiltig e-post!'})
    @IsNotEmpty({ message: 'E-post får inte vara tom!' })
    email!: string;

    @IsString({ message: 'Lösenord måste anges!' })
    @IsNotEmpty({ message: 'Lösenord får inte vara tomt!' })
    @MinLength(6, { message: 'Lösenord måste vara minst 6 tecken!' })
    password!: string;

    @IsOptional()
    @IsString()
    role?: string;
}