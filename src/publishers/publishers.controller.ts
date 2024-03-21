import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PublishersService } from './publishers.service';
import { PublisherDto } from "../dto/publisher.dto";
import { CheckRoleGuard } from "../middlewares/checkRole.guard";
import { CheckAuthGuard } from "../middlewares/checkAuth.guard";
import { PublisherEntity } from "../entities/publisher.entity";

@ApiTags('publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @UseGuards(CheckRoleGuard, CheckAuthGuard)
  @ApiOperation({ summary: 'Create a new publisher' })
  @ApiBearerAuth()
  @ApiBody({ type: PublisherDto })
  @ApiResponse({ status: 201, description: 'The publisher has been successfully created'})
  async createPublisher(@Body() publisherDto: PublisherDto): Promise<PublisherEntity> {
    return await this.publishersService.create(publisherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all publishers' })
  @ApiResponse({ status: 200, description: 'List of all publishers'})
  async getAll(): Promise<PublisherEntity[]> {
    return await this.publishersService.getAll();
  }
}
