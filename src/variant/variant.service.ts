import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantService {
    constructor(
        @InjectRepository(Variant)
        private readonly variantRepo: Repository<Variant>,
        
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>
    ) {}

    async create(dto: CreateVariantDto) {
        try {
            if (!dto.productId) {
                throw new BadRequestException({
                    field: 'productId',
                    message: 'productId måste anges när man skapar variant separat'
                });
            }
            
            const product = await this.productRepo.findOne({
                where: { id: dto.productId }
            });

            if(!product) {
                throw new BadRequestException({
                    field: 'productId',
                    message: 'Produkten finns inte'
                });
            }

            const variant = await this.variantRepo.create({
                size: dto.size,
                price: dto.price,
                stock_quantity: dto.stock_quantity,
                product
            });

            const savedVariant = await this.variantRepo.save(variant);

            return {
                message: 'Varianten har lagts till',
                variant: savedVariant
            }
        } catch (error) {
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när varianten skulle läggas till'
            });
        }
    }

    async findAll() {
        try {
            const variants = await this.variantRepo.find({
                relations: ['product']
            });

            if(!variants || variants.length === 0) {
                throw new NotFoundException({
                    message: 'Inga varianter hittades'
                });
            } 
            
            return variants;
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstått vid hämtning av varianter'
            });
        }
    }

    async findOne(id: number) {
        try {
            const variant = await this.variantRepo.findOne({
                where: { id },
                relations: ['product']
            });

            if(!variant) {
                throw new NotFoundException({
                    field: 'id',
                    message: `Varianten med ID ${id} finns inte`
                });
            }

            return variant;
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod vid hämtning av varianten'
            })
        }
    }

    async update(id: number, dto: UpdateVariantDto) {
        try {
            const variant = await this.findOne(id);

            Object.assign(variant, dto);

            const savedVariant = await this.variantRepo.save(variant);

            return {
                message: `Varianten med id ${id} har uppdaterats`,
                variant: savedVariant
            }
        } catch (error) {
            if(error instanceof NotFoundException) return error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera varianter'
            });
        }
    }

    async updateStock(id: number, quantity: number) {
        try {
            const variant = await this.findOne(id);

            variant.stock_quantity = quantity;

            const savedVariant = await this.variantRepo.save(variant);

            return {
                message: 'Lagersaldo uppdaterat',
                variant: savedVariant
            }
        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera lagersaldo'
            });
        }
    }

    async remove(id: number) {
        try {
            const variant = await this.findOne(id);

            const removedVariant = await this.variantRepo.remove(variant);

            return {
                message: `Varianten med id ${id} har raderats!`,
                variant: removedVariant
            }
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte radera varianten'
            })
        }
    }
}
