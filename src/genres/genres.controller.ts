import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GenresService } from './genres.service';
import { GenreDto } from "../dto/genre.dto";
import { CheckAuthGuard } from "../middlewares/checkAuth.guard";
import { CheckRoleGuard } from "../middlewares/checkRole.guard";
import {GenreEntity} from "../entities/genre.entity";

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiBearerAuth()
  @ApiBody({ type: GenreDto })
  @ApiResponse({ status: 201, description: 'The genre has been successfully created' })
  async createGenre(@Body() genreDto: GenreDto): Promise<GenreEntity> {
    return await this.genresService.create(genreDto);
  }
}
