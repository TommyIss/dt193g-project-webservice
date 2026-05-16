import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    name!: string;

    @OneToMany(() => Product, product => product.category)
    products!: Product[];

    @CreateDateColumn()
    added_at!: Date;
    
    @UpdateDateColumn()
    updated_at!: Date;
}