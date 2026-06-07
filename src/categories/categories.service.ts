import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>
    ) {}

    async create(data: CreateCategoryDto) {
        try {
            const exits = await this.categoryRepo.findOne({ where: {name: data.name}});

            if(exits) {
                throw new BadRequestException({
                    field: 'name',
                    message: 'Kategori finns redan'
                });
            }

            const category = await this.categoryRepo.create(data);
            const savedCategory = await this.categoryRepo.save(category);

            return {
                message: 'Kategori har skapats',
                category: savedCategory
            }

        } catch (error) {
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när kategorin skulle skapas'
            });
        }
    }

    async findAll() {
        try {
            const categories = await this.categoryRepo.find();

            return categories;
        } catch (error) {

            throw new InternalServerErrorException({
                message: 'Kunde inte hämta kategorier'
            });
        }
    }

    async findOne(id: number) {
        try {
            const category = await this.categoryRepo.findOne({ where: {id}});

            if(!category) {
                throw new NotFoundException({
                    field: 'id',
                    message: `Kategorin med ID ${id} finns ej`
                });
            }

            return category;
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte hämta kategori'
            });
        }
    }

    async update(id: number, data: UpdateCategoryDto) {
        try {
            const category = await this.findOne(id);

            if(data.name) {
                const exists = await this.categoryRepo.findOne({ where: { name: data.name }});

                if(exists && exists.id !== id) {
                    throw new BadRequestException({
                        field: 'name',
                        message: 'En annan kategori med samma namn finns redan'
                    });
                }
            }

            Object.assign(category, data);

            const savedCategory = await this.categoryRepo.save(category);
            return {
                message: `Kategori med ID ${id} har uppdaterats`,
                category: savedCategory
            }
        } catch (error) {
            if(error instanceof BadRequestException) throw error;
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte uppdatera kategori'
            });
        }
    }

    async remove(id: number) {
        try {
            const category = await this.findOne(id);
            const removedCategory = await this.categoryRepo.remove(category);

            return {
                message: `Kategori med ID ${id} har raderats`,
                category: removedCategory
            }
        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Kunde inte radera kategori'
            });
        }
    }
}
