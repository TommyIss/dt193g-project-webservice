import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrStaffGuard } from 'src/auth/admin-staff.guard';

@Controller('variants')
export class VariantController {
    constructor(
        private readonly variantService: VariantService
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(@Body() dto: CreateVariantDto) {
        return this.variantService.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findAll() {
        return this.variantService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.variantService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariantDto) {
        return this.variantService.update(id, dto);
    }

    @Patch(':id/stock')
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    updateStock(
        @Param('id', ParseIntPipe) id: number,
        @Body('quantity', ParseIntPipe) quantity: number
    ) {
        return this.variantService.updateStock(id, quantity);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.variantService.remove(id);
    }
}
