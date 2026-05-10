import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        try {
            if(!email || email === '') {
                throw new BadRequestException({
                    field: 'email',
                    message: 'E-post måste anges'
                });
            }

            if(!password || password === '') {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste anges'
                });
            }
            const user = await this.usersService.findByEmail(email);

            if(!user) {
                throw new UnauthorizedException('Ogilitga e-post/lösenord');
            }

            const isMatched = await bcrypt.compare(password, user.password);

            if(!isMatched) {
                throw new UnauthorizedException('Ogilitga e-post/lösenord');
            }

            return user;
        } catch (error) {
            if(error instanceof BadRequestException) throw error;
            if(error instanceof UnauthorizedException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett oväntat fel uppstod vid validering av konto'
            });
        }
        
    }

    async login(user: User) {
        const payload = { sub: user.id };

        const foundUser = await this.usersService.findByEmail(user.email);

        if(!foundUser) {
            throw new UnauthorizedException('Ogilitga e-post/lösenord');
        }

        return {
            message: 'Inloggning lyckades!',
            access_token: this.jwtService.sign(payload),
            user: foundUser
        }
    }
}
