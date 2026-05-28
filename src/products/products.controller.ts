import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrStaffGuard } from 'src/auth/admin-staff.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(
        @Body(new ValidationPipe({ transform: true })) body: any, 
        @UploadedFile() file?: Express.Multer.File) {
        
        if (typeof body.variants === 'string') {
            body.variants = JSON.parse(body.variants);
        }
        return this.productsService.create(body, file);
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
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return this.productsService.updateImage(id, imageUrl);
    }

    @Delete(':id/delete-image')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteImage(id);
    }
}
