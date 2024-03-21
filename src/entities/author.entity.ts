import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {BookEntity} from "./book.entity";

@Entity()
@Unique(['name'])
export class AuthorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    birthday: Date

    @ManyToMany(() => BookEntity, (book) => book.authors)
    books: BookEntity[]
}
