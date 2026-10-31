import {
  Controller,
  Delete,
  Get,
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
  async restoreFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
  ) {
    return this.trashService.restoreFile(fileId);
  }

  @Patch('folders/:folderId/restore')
  async restoreFolder(
    @Param('folderId', new ParseUUIDPipe({ version: '4' })) folderId: string,
  ) {
    return this.trashService.restoreFolder(folderId);
  }

  @Delete('files/:fileId')
  async permanentlyDeleteFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
  ) {
    return this.trashService.permanentlyDeleteFile(fileId);
  }

  @Delete('folders/:folderId')
  async permanentlyDeleteFolder(
    @Param('folderId', new ParseUUIDPipe({ version: '4' })) folderId: string,
  ) {
    return this.trashService.permanentlyDeleteFolder(folderId);
  }
}
