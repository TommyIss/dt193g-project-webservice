import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        private readonly cloudinaryService: CloudinaryService
    ) {}

    async create(dto: CreateProductDto, file?: Express.Multer.File) {
        try {
            const category = await this.categoryRepo.findOne({
                where: {id: dto.categoryId}
            });

            if(!category) {
                throw new BadRequestException({
                    field: 'categoryId',
                    message: 'Kategorin finns inte'
                });
            }

            let imageUrl: string | null = null;

            if(file) {
                imageUrl = await this.cloudinaryService.uploadImage(file);
            }

            const product = await this.productRepo.create({
                ...dto, 
                category,
                image_url: imageUrl ?? null
            });

            const savedProduct = await this.productRepo.save(product);

            return {
                message: 'Produkten har lagts till',
                product: savedProduct
            }
        } catch (error) {
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när produkten skulle läggas till'
            });
        }
    }

    async findAll() {
        try {
            const products = await this.productRepo.find({
                relations: ['category', 'variants']
            });

            if(!products || products.length === 0) {
                throw new NotFoundException({
                    message: 'Inga produkter hittades'
                });
            }

            return products;
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte hämta produkter'
            });
        }
    }

    async findOne(id: number) {
        try {
            const product = await this.productRepo.findOne({
                where: { id },
                relations: ['category', 'variants']
            });

            if(!product) {
                throw new NotFoundException({
                    field: 'id',
                    message: `Produkten med ID ${id} finns inte`
                });
            }

            return product;
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte hämta produkt'
            });
        }
    }

    async update(id: number, dto: UpdateProductDto) {
        try {
            const product = await this.findOne(id);

            if(dto.categoryId) {
                const category = await this.categoryRepo.findOne({
                    where: { id: dto.categoryId }
                });

                if(!category) {
                    throw new BadRequestException({
                        field: 'categoryId',
                        message: 'Kategorin finns inte'
                    });
                }

                product.category = category;
            }

            Object.assign(product, dto);

            const savedProduct = await this.productRepo.save(product);

            return {
                message: `Produkten med ID ${id} har uppdaterats`,
                product: savedProduct
            }
        } catch (error) {
            if(error instanceof BadRequestException) throw error;
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera produkt'
            });
        }
    }

    async remove(id: number) {
        try {
            const product = await this.findOne(id);
            const removedProduct = await this.productRepo.remove(product);

            return {
                message: `Produkt med ID ${id} har raderats`,
                product: removedProduct
            };
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte radera produkt'
            });
        }
    }

    async updateImage(id: number, imageUrl: string) {
        try {
            const product = await this.findOne(id);

            product.image_url = imageUrl;

            const savedProduct = await this.productRepo.save(product);

            return {
                message: 'Produktbild uppdaterad',
                product: savedProduct
            };
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera produktbild'
            })
        }
    }
}
