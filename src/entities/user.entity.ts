import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {BookEntity} from "./book.entity";
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";

@Entity()
@Unique(['login'])
export class UserEntity{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @OneToMany(() => BookEntity, (book) => book.currentUser)
    books: BookEntity[]

    @ApiHideProperty()
    @Column({default: "user"})
    role: string

    @ApiHideProperty()
    @Column()
    login: string

    @ApiHideProperty()
    @Column()
    password: string
}
