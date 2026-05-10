import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post('create-admin')
    async createAdmin(@Body() dto: CreateUserDto) {
        return this.usersService.createAdmin(dto);
    }
}
