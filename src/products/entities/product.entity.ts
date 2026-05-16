import { Category } from "src/categories/entities/category.entity";
import { Variant } from "src/variant/entities/variant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ type: 'varchar', nullable: true })
    image_url!: string | null;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE'})
    category!: Category;
    
    @OneToMany(() => Variant, variant => variant.product)
    variants!: Variant[];

    @Column()
    categoryId!: number;

    @CreateDateColumn()
    added_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}