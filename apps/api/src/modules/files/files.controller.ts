import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async getFiles(
    @Query('folderId', new ParseUUIDPipe({ version: '4', optional: true }))
    folderId?: string,
  ) {
    return this.filesService.getFiles(folderId);
  }

  @Post()
  async createFile(@Body() fileDto: CreateFileDto) {
    return this.filesService.createFile(fileDto);
  }

  @Delete(':fileId')
  async deleteFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
  ) {
    return this.filesService.deleteFile(fileId);
  }
}
