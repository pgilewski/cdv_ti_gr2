import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('stes')
export class ResourcesController {
  constructor(private readonly stesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.stesService.create(createResourceDto);
  }

  @Get()
  findAll() {
    return this.stesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.stesService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stesService.remove(+id);
  }
}
