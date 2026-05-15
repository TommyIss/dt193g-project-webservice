import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrStaffGuard } from 'src/auth/admin-staff.guard';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}
