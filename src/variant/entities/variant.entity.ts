import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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
}