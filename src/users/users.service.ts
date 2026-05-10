import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async create(data: CreateUserDto) {
        try {
            if(!data.firstname || data.firstname === '') {
                throw new BadRequestException({
                    field: 'firstname',
                    message: 'Förnamn måste anges'
                })
            }

            if(!data.lastname || data.lastname === '') {
                throw new BadRequestException({
                    field: 'lastname',
                    message: 'Efternamn måste anges'
                })
            }

            if(!data.email || data.email === '') {
                throw new BadRequestException({
                    field: 'email',
                    message: 'E-post måste anges'
                })
            }

            if(!data.password || data.password === '') {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste anges'
                })
            }

            if(data.password.length < 6) {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste vara minst 6 tecken'
                });
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = this.userRepo.create({
                ...data, 
                password: hashedPassword 
            });

            const savedUser = await this.userRepo.save(user);

            return {
                message: 'Användarkonto har skapats',
                body: savedUser
            }

        } catch (error) {
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett oväntat fel uppstod när kontot skulle skapas'
            });
        }
    }

    async createAdmin(data: CreateUserDto) {
        try {
            if(!data.firstname || data.firstname === '') {
                throw new BadRequestException({
                    field: 'firstname',
                    message: 'Förnamn måste anges'
                })
            }

            if(!data.lastname || data.lastname === '') {
                throw new BadRequestException({
                    field: 'lastname',
                    message: 'Efternamn måste anges'
                })
            }

            if(!data.email || data.email === '') {
                throw new BadRequestException({
                    field: 'email',
                    message: 'E-post måste anges'
                })
            }

            if(!data.password || data.password === '') {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste anges'
                })
            }

            if(data.password.length < 6) {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste vara minst 6 tecken'
                });
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = this.userRepo.create({
                ...data,
                password: hashedPassword,
                role: 'admin'
            });
        
            const savedUser = await this.userRepo.save(user);

            return {
                message: 'Adminkonto har skapats!',
                body: savedUser
            }

        } catch (error) {
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett oväntat fel uppstod när kontot skulle skapas'
            });
        }
        
        
    }

    async findAll() {
        try {
            
            const users = await this.userRepo.find();

            if(!users || users.length === 0) {
                throw new NotFoundException({
                    message: 'Inga konto hittades!',
                });
            }

            return users;
            
        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            
            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när konto skulle hämtas'
            })
        }
    }

    async findOne(id: number) {
        try {
            
            const user = await this.userRepo.findOne({ where: { id }});

            if(!user) {
                throw new NotFoundException(`Kontot med ID ${id} finns ej!`);
            }

            return user;

        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när konto skulle hämtas'
            });
        }
    }

    async findByEmail(email: string) {
        try {
            
            const user = await this.userRepo.findOne({ where: { email }});

            if(!user) {
                throw new NotFoundException(`Kontot med e-post ${email} finns ej!`);
            }

            return user;

        } catch (error) {
            if(error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när konto skulle hämtas'
            });
        }
    }

    async update(id: number, updatedData: UpdateUserDto) {
        try {
            
            const user = await this.findOne(id);
            
            if(!updatedData.firstname || updatedData.firstname === '') {
                throw new BadRequestException({
                    field: 'firstname',
                    message: 'Förnamn måste anges'
                })
            }

            if(!updatedData.lastname || updatedData.lastname === '') {
                throw new BadRequestException({
                    field: 'lastname',
                    message: 'Efternamn måste anges'
                })
            }

            if(!updatedData.email || updatedData.email === '') {
                throw new BadRequestException({
                    field: 'email',
                    message: 'E-post måste anges'
                })
            }

            if(!updatedData.password || updatedData.password === '') {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste anges'
                })
            }

            if(updatedData.password.length < 6) {
                throw new BadRequestException({
                    field: 'password',
                    message: 'Lösenord måste vara minst 6 tecken'
                });
            }

            if(updatedData.password) {
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }

            Object.assign(user, updatedData);

            const savedUser = await this.userRepo.save(user);

            return {
                message: `Användarkonto med id ${id} har uppdaterats!`,
                updatedUser: savedUser
            }

        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när kontot skulle uppdateras'
            });
        }
    }

    async remove(id: number) {
        try {
            const user = await this.findOne(id);
            
            const removedUser = await this.userRepo.remove(user);

            return {
                message: `Användarkonto med id ${id} har raderats!`,
                deletedUser: removedUser
            }

        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            if(error instanceof BadRequestException) throw error;

            throw new InternalServerErrorException({
                message: 'Ett fel uppstod när kontot skulle uppdateras'
            });
        }
    }
}
