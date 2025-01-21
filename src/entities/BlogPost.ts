import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class BlogPost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: string;

    @Column({ nullable: true })
    media!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;
}
