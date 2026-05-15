import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrStaffGuard } from 'src/auth/admin-staff.guard';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productsService.create(dto, file);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), AdminOrStaffGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }

    @Patch(':id/upload-image')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return this.productsService.updateImage(id, imageUrl);
    }
}
