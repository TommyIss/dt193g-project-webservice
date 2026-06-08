import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstname!: string;

    @Column()
    lastname!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ 
        type: 'varchar',
        default: 'staff' 
    })
    role!: 'admin' | 'staff';
    
    @CreateDateColumn()
    added_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}