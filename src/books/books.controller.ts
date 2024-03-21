import { Body, Controller, Get, Param, Post, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BooksService } from './books.service';
import { CheckRoleGuard } from "../middlewares/checkRole.guard";
import { BookDto } from "../dto/book.dto";
import { BookEntity, IHistory } from "../entities/book.entity";
import { CheckAuthGuard } from "../middlewares/checkAuth.guard";

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
      private readonly booksService: BooksService,
  ) {}

  @Post()
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created' })
  @ApiBody({ type: BookDto })
  async createBook(@Body() bookDto: BookDto): Promise<BookEntity>{
    return await this.booksService.create(bookDto);
  }

  @Get('/:id/history')
  @ApiOperation({ summary: 'Get history of a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  async getHistory(@Param('id') id: number): Promise<IHistory[]> {
    return await this.booksService.getHistory(id);
  }

  @Post('/borrow')
  @UseGuards(CheckAuthGuard)
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiBearerAuth()
  @ApiBody({ type: Number, description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'The book has been successfully borrowed' })
  async borrowBook(@Body('book') bookId: number, @Headers('Authorization') token: string){
    return await this.booksService.borrowBook(bookId, token);
  }

  @Post('/return')
  @UseGuards(CheckAuthGuard)
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiBearerAuth()
  @ApiBody({ type: Number, description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'The book has been successfully returned' })
  async returnBook(@Body('book') bookId: number, @Headers('Authorization') token: string){
    return await this.booksService.returnBook(bookId, token);
  }
}
