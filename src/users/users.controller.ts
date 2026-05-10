import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrOwnerGuard } from 'src/auth/admin-owner.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), AdminOrOwnerGuard)
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), AdminOrOwnerGuard)
    update(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.usersService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
