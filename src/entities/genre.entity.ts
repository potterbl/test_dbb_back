import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(['title'])
export class GenreEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
}
