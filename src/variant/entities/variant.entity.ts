import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Variant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: 'One Size' })
    size!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'int' , default: 0 })
    stock_quantity!: number;

    @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE'})
    product!: Product;

    @Column()
    productId!: number;
    
    @CreateDateColumn()
    added_at!: Date;
    
    @UpdateDateColumn()
    updated_at!: Date;
}