import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';

import { AuthorsService } from './authors.service';
import { BookEntity } from "../entities/book.entity";
import { AuthorDto } from "../dto/author.dto";
import { CheckRoleGuard } from "../middlewares/checkRole.guard";
import { CheckAuthGuard } from "../middlewares/checkAuth.guard";
import {AuthorEntity} from "../entities/author.entity";

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('/:id/books')
  @ApiOperation({ summary: 'Get books by author ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'List of books by author' })
  async getBooks(@Param('id') id: number): Promise<BookEntity[]> {
    return await this.authorsService.getBooks(id);
  }

  @Post()
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @ApiOperation({ summary: 'Create a new author' })
  @ApiBearerAuth()
  @ApiBody({ type: AuthorDto })
  @ApiResponse({ status: 201, description: 'The author has been successfully created' })
  async createAuthor(@Body() authorDto: AuthorDto): Promise<AuthorEntity>{
    return await this.authorsService.create(authorDto);
  }
}
