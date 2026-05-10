import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Post('login')
    async login(@Body() body: {email: string, password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);

        if(!user) {
            throw new UnauthorizedException('Ogilitga e-post/lösenord');
        }

        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() req) {
        const userProfile = await this.usersService.findByEmail(req.user.email);

        return {
            response: req.user,
            userProfile: userProfile
        };
    }
}
