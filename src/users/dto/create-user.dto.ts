import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Förnamn måste vara en textsträng!' })
    @MinLength(1, { message: 'Förnamn får inte vara tomt!' })
    firstname!: string;

    @IsString({ message: 'Efternamn måste vara en textsträng!' })
    @MinLength(1, { message: 'Efternamn får inte vara tomt!' })
    lastname!: string;
    
    @IsEmail({}, { message: 'Ogiltig e-postadress!' })
    email!: string;

    @IsString({ message: 'Lösenord måste vara en textsträng!' })
    @MinLength(6, { message: 'Lösenord måste vara minst 6 tecken!' })
    password!: string;

    @IsOptional()
    @IsString()
    @IsIn(['admin', 'staff'], { message: 'Rollen måste vara antingen admin eller staff!' })
    role?: 'admin' | 'staff'; // Sträng-literals matchar nu entiteten perfekt!
}