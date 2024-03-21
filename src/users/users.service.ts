import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import * as jwt from 'jsonwebtoken';
import {BookEntity} from "../entities/book.entity";
import {UserDto} from "../dto/user.dto";
import {config} from "dotenv";
config()

const jwt_key = process.env.JWT_KEY

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>
    ) {
    }

    async checkRole(token: string): Promise<string> {
        try {
            const jwtPayloads = jwt.verify(token, jwt_key)

            const candidate = await this.userRepo.findOne({
                where: {
                    id: jwtPayloads.id
                }
            })

            if(!candidate) throw new UnauthorizedException("User wasn't found")

            return candidate.role
        } catch (e) {
            throw new UnauthorizedException(e)
        }
    }

    async getUser({ token, id }: { token?: string, id?: number }): Promise<UserEntity>{
        try {
            if(token){
                const jwtPayloads = jwt.verify(token, jwt_key)

                const candidate = await this.userRepo.findOne({
                    where: {
                        id: jwtPayloads.id
                    }
                })

                if(!candidate) throw new UnauthorizedException("User wasn't found")

                return candidate
            } else if (id){
                const candidate = await this.userRepo.findOne({
                    where: {
                        id: id
                    }
                })

                if(!candidate) throw new UnauthorizedException("User wasn't found")

                return candidate
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async addBookToUser (book: BookEntity, userId: number) {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    id: userId
                },
                relations: ["books"]
            })

            user.books.push(book)

            return await this.userRepo.save(user)
        } catch (e) {
            throw new Error(e)
        }
    }

    async removeBookToUser (book: BookEntity, userId: number) {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    id: userId
                },
                relations: ["books"]
            })

            user.books = user.books.filter(entry => entry.id !== book.id)

            return await this.userRepo.save(user)
        } catch (e) {
            throw new Error(e)
        }
    }

    async createUser(userDto: UserDto) {
        try {
            const newUser = new UserEntity()

            newUser.login = userDto.login
            newUser.password = userDto.password

            const savedUser = await this.userRepo.save(newUser)

            const payloads = {
                id: savedUser.id,
                login: savedUser.login
            }

            const jwtPayloads = jwt.sign(payloads, jwt_key, {expiresIn: '7d'})

            return {token: jwtPayloads}
        } catch (e) {
            throw new Error(e)
        }
    }

    async login(userDto: UserDto) {
        try {
            const candidate = await this.userRepo.findOne({
                where: {
                    login: userDto.login
                }
            })

            if(candidate.password !== userDto.password) throw new ConflictException("Password is incorrect or user was not found")

            const payloads = {
                id: candidate.id,
                login: candidate.login
            }

            const jwtPayloads = jwt.sign(payloads, jwt_key, {expiresIn: '7d'})

            return {token: jwtPayloads}
        } catch (e) {
            throw new Error(e)
        }
    }
}
