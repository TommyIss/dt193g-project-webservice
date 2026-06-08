import { Category } from "src/categories/entities/category.entity";
import { Variant } from "src/variant/entities/variant.entity";
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    RelationId,
    UpdateDateColumn 
} from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    image_url?: string | null;

    @Column({ type: 'varchar', nullable: true, default: null })
    image_public_id?: string | null;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
    category!: Category;
    
    @Column()
    @RelationId((product: Product) => product.category)
    categoryId!: number;

    @OneToMany(() => Variant, variant => variant.product)
    variants!: Variant[];

    @CreateDateColumn()
    added_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}