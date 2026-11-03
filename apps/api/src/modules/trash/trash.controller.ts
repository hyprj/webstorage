import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { TrashService } from './trash.service';

@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get()
  async getTrash() {
    return this.trashService.getTrash();
  }

  @Patch('files/:fileId/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
  ): Promise<void> {
    await this.trashService.restoreFile(fileId);
  }

  @Patch('folders/:folderId/restore')
  async restoreFolder(
    @Param('folderId', new ParseUUIDPipe({ version: '4' })) folderId: string,
  ) {
    return this.trashService.restoreFolder(folderId);
  }

  @Delete('files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
  ): Promise<void> {
    await this.trashService.deleteFile(fileId);
  }

  @Delete('folders/:folderId')
  async permanentlyDeleteFolder(
    @Param('folderId', new ParseUUIDPipe({ version: '4' })) folderId: string,
  ) {
    return this.trashService.permanentlyDeleteFolder(folderId);
  }
}
