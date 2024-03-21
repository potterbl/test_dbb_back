import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {BookEntity} from "./book.entity";

@Entity()
@Unique(['establishedYear'])
export class PublisherEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    establishedYear: number;

    @OneToMany(() => BookEntity, (book) => book.publisher)
    books: BookEntity[]
}
