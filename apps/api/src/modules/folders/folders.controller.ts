import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller()
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get('folders')
  async getFolders(@Query('parentId') parentId?: string | null) {
    return this.foldersService.getFolders(parentId);
  }

  @Get('folder')
  async getFolderById(@Query('id') id: string) {
    return this.foldersService.getFolderById(id);
  }

  @Post('folders')
  async createFolder(@Body() dto: CreateFolderDto) {
    return this.foldersService.createFolder(dto);
  }

  @Delete('folders/:id')
  async deleteFolder(@Param('id') id: string) {
    return this.foldersService.deleteFolder(id);
  }
}
