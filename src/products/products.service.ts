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
    ) { }

    async create(dto: CreateProductDto, file?: Express.Multer.File) {
        try {
            // AIRBAG 1: Manuell validering av tomma värden för att stoppa 500-fel i databasen
            const validationErrors: Array<string | { field: string; message: string }> = [];

            if (!dto.name || String(dto.name).trim() === '') {
                validationErrors.push('Produktnamn får inte vara tomt!');
            }
            if (!dto.description || String(dto.description).trim() === '') {
                validationErrors.push('Beskrivning får inte vara tomt!');
            }
            if (!dto.categoryId || isNaN(Number(dto.categoryId))) {
                validationErrors.push('Kategori får inte vara tomt!');
            }

            let checkVariants: any = dto.variants;
            if (typeof checkVariants === 'string') {
                try {
                    checkVariants = JSON.parse(checkVariants);
                } catch {
                    checkVariants = [];
                }
            }

            if (!checkVariants || !Array.isArray(checkVariants) || checkVariants.length === 0) {
                validationErrors.push({
                    field: 'variants',
                    message: 'Du måste lägga till minst en variant (storlek, pris och lagersaldo)!'
                });
            }

            // Om vi hittade några tomma fält, avbryt direkt med 400 Bad Request
            if (validationErrors.length > 0) {
                throw new BadRequestException(validationErrors);
            }

            // 2. Kontrollera om kategorin finns i databasen
            const category = await this.categoryRepo.findOne({
                where: { id: Number(dto.categoryId) }
            });

            if (!category) {
                throw new BadRequestException(['Kategorin finns inte i databasen']);
            }

            // 3. Hantera bild till Cloudinary
            let imageUrl: string | undefined = undefined;
            let imagePublicId: string | undefined = undefined;

            if (file) {
                const uploaded = await this.cloudinaryService.uploadImage(file);
                imageUrl = uploaded.url;
                imagePublicId = uploaded.publicId;
            }

            // 4. Skapa och spara produkten
            const product = this.productRepo.create({
                name: dto.name,
                description: dto.description,
                categoryId: Number(dto.categoryId),
                image_url: imageUrl,
                image_public_id: imagePublicId
            });

            const savedProduct = await this.productRepo.save(product);

            // 5. Hantera varianter säkert (DTO:n garanterar nu att det är en array)
            if (dto.variants && dto.variants.length > 0) {
                const variantEntities = dto.variants.map((v: any) => ({
                    ...v,
                    productId: savedProduct.id
                }));
                await this.variantRepo.save(variantEntities);
            }

            return {
                message: 'Produkten har lagts till',
                product: savedProduct
            }

        } catch (error: any) {
            // Logga felet i din backend-terminal så du ser om något annat blir fel
            console.error('--- FEL VID SKAPANDE AV PRODUKT ---', error);

            // Om det är vårt eget 400-fel, skicka vidare det direkt till frontend
            if (error instanceof BadRequestException) throw error;

            // Om något annat oväntat kraschar, skicka med kraschmeddelandet i 500-felet
            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när produkten skulle läggas till',
                error: error.message || String(error)
            });
        }
    }

    async findAll() {
        try {
            const products = await this.productRepo.find({
                relations: ['category', 'variants']
            });

            return products;
        } catch (error) {

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

            if (!product) {
                throw new NotFoundException({
                    field: 'id',
                    message: `Produkten med ID ${id} finns inte`
                });
            }

            return product;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte hämta produkt',
                error: error.message || String(error)
            });
        }
    }

    async update(id: number, dto: UpdateProductDto, file?: Express.Multer.File) {
        try {
            const product = await this.productRepo.findOne({
                where: { id },
                relations: ['variants']
            });

            if (!product) {
                throw new NotFoundException({
                    field: 'id',
                    message: `Produkten med ID ${id} hittades inte`
                });
            }

            const validationErrors: Array<{ field: string; message: string }> = [];

            if (dto.name !== undefined && dto.name.trim() === '') {
                validationErrors.push({ field: 'name', message: 'Produktnamn får inte vara tomt' });
            }

            if (dto.description !== undefined && dto.description.trim() === '') {
                validationErrors.push({ field: 'description', message: 'Beskrivning får inte vara tom' });
            }

            if (dto.categoryId !== undefined) {
                const category = await this.categoryRepo.findOne({
                    where: { id: dto.categoryId }
                });

                if (!category) {
                    validationErrors.push({
                        field: 'categoryId',
                        message: 'Den valda kategorin finns inte'
                    });
                }
            }

            if (validationErrors.length > 0) {
                throw new BadRequestException(validationErrors);
            }

            if (file) {
                const uploaded = await this.cloudinaryService.uploadImage(file);
                product.image_url = uploaded.url;
                product.image_public_id = uploaded.publicId;
            }

            Object.assign(product, {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId })
            });

            const savedProduct = await this.productRepo.save(product);

            if (dto.variants !== undefined) {
                await this.variantRepo.delete({ productId: id });

                if (dto.variants.length > 0) {
                    const variantEntities = dto.variants.map(v => ({
                        ...v,
                        productId: id
                    }));

                    await this.variantRepo.save(variantEntities);
                }
            }

            return {
                message: `Produkten med ID ${id} har uppdaterats`,
                product: savedProduct
            };

        } catch (error: any) {
            console.error('--- FEL VID PRODUKTUPPDATERING ---', error);

            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när produkten skulle uppdateras',
                error: error.message
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
            if (error instanceof NotFoundException) throw error;

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
            if (error instanceof NotFoundException) throw error;

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
            if (error instanceof NotFoundException) throw error;
            if (error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera produktbild'
            })
        }
    }


}
