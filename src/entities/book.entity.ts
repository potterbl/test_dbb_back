import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AuthorEntity} from "./author.entity";
import {GenreEntity} from "./genre.entity";
import {UserEntity} from "./user.entity";
import {PublisherEntity} from "./publisher.entity";

export interface IHistory {
    User: UserEntity;
    DateBorrow: Date;
    DateReturn: Date | null;
}

@Entity()
export class BookEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    isbn: string;

    @ManyToMany(() => AuthorEntity, (author) => author.books)
    @JoinTable()
    authors: AuthorEntity[]

    @ManyToOne(() => PublisherEntity, (publisher) => publisher.books)
    publisher: PublisherEntity

    @ManyToMany(() => GenreEntity)
    @JoinTable()
    genres: GenreEntity[]

    @ManyToOne(() => UserEntity, (user) => user.books, {nullable: true})
    currentUser: UserEntity

    @Column({type: 'jsonb'})
    history: IHistory[]

    @Column()
    publishDate: Date
}
