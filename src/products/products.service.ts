import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Variant } from 'src/variant/entities/variant.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>, 
        
        @InjectRepository(Variant)
        private readonly variantRepo: Repository<Variant>,

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
            
            let imageUrl: string | undefined = undefined;
            let imagePublicId: string | undefined = undefined;

            if(file) {
                const uploaded = await this.cloudinaryService.uploadImage(file);
                imageUrl = uploaded.url;
                imagePublicId = uploaded.publicId;
            }

            const product = this.productRepo.create({
                name: dto.name,
                description: dto.description,
                categoryId: dto.categoryId,
                image_url: imageUrl,
                image_public_id: imagePublicId
            });
            
            const savedProduct = await this.productRepo.save(product);

            if(dto.variants && dto.variants.length > 0) {
                const variantEntities = dto.variants.map(v => ({
                    ...v,
                    productId: savedProduct.id
                }));

                await this.variantRepo.save(variantEntities);
            }

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

            if (dto.categoryId !== undefined) {
            const category = await this.categoryRepo.findOne({
                where: { id: dto.categoryId }
            });

            if (!category) {
                throw new BadRequestException({
                    field: 'categoryId',
                    message: 'Kategorin finns inte'
                });
            }

            product.categoryId = dto.categoryId;
        }

        if (dto.name !== undefined) product.name = dto.name;
        if (dto.description !== undefined) product.description = dto.description;

        if (dto.variants && dto.variants.length > 0) {
            for (const variantDto of dto.variants) {

                if (!variantDto.id) {
                    throw new BadRequestException({
                        field: 'variant.id',
                        message: 'Variant-ID måste anges vid uppdatering'
                    });
                }

                await this.variantRepo.update(variantDto.id, {
                    size: variantDto.size,
                    price: variantDto.price,
                    stock_quantity: variantDto.stock_quantity
                });
            }
        }

        // 4. Spara produkten
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

    async updateImage(id: number, image: { url: string; publicId: string }) {
        try {
            const product = await this.findOne(id);

            if (!product) {
                throw new NotFoundException('Produkten finns inte');
            }

            // Radera gammal bild om den finns
            if (product.image_public_id) {
                await this.cloudinaryService.deleteImage(product.image_public_id);
            }

            product.image_url = image.url;
            product.image_public_id = image.publicId;

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

    async deleteImage(id: number) {
        try {
            
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Produkten finns inte');
        }

        if (!product.image_public_id) {
            throw new BadRequestException('Produkten har ingen bild att radera');
        }

        await this.cloudinaryService.deleteImage(product.image_public_id);

        product.image_url = null;
        product.image_public_id = null;

        await this.productRepo.save(product);

        return { message: 'Bilden har raderats' };

        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            if(error instanceof BadRequestException) throw error;
            
            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera produktbild'
            })
        }    
    }


}
