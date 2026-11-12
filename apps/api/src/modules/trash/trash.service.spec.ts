import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DefaultRetentionService } from '../dataRetention/defaultRetention/default-retention.service';
import { File, Folder } from '../../db/schema';
import { FoldersRepository } from '../folders/folders.repository';
import { TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

describe('TrashService', () => {
  let trashRepository: {
    findNonDeletedFile: Mock<TrashRepository['findNonDeletedFile']>;
    findDeleted: Mock<TrashRepository['findDeleted']>;
    findDeletedFile: Mock<TrashRepository['findDeletedFile']>;
    permanentlyDeleteFile: Mock<TrashRepository['permanentlyDeleteFile']>;
    restoreFile: Mock<TrashRepository['restoreFile']>;
    findDeletedFolder: Mock<TrashRepository['findDeletedFolder']>;
    permanentlyDeleteFolder: Mock<TrashRepository['permanentlyDeleteFolder']>;
    restoreFolder: Mock<TrashRepository['restoreFolder']>;
  };
  let foldersRepository: {
    markDeleted: Mock<FoldersRepository['markDeleted']>;
    findChildren: Mock<FoldersRepository['findChildren']>;
    findById: Mock<FoldersRepository['findById']>;
    create: Mock<FoldersRepository['create']>;
  };
  let service: TrashService;
  let defaultRetentionService: DefaultRetentionService;
  let canPermanentlyDeleteEntry: Mock<
    DefaultRetentionService['canPermanentlyDeleteEntry']
  >;

  beforeEach(() => {
    trashRepository = {
      findNonDeletedFile: vi.fn<TrashRepository['findNonDeletedFile']>(),
      findDeleted: vi.fn<TrashRepository['findDeleted']>(),
      findDeletedFile: vi.fn<TrashRepository['findDeletedFile']>(),
      permanentlyDeleteFile: vi.fn<TrashRepository['permanentlyDeleteFile']>(),
      restoreFile: vi.fn<TrashRepository['restoreFile']>(),
      findDeletedFolder: vi.fn<TrashRepository['findDeletedFolder']>(),
      permanentlyDeleteFolder:
        vi.fn<TrashRepository['permanentlyDeleteFolder']>(),
      restoreFolder: vi.fn<TrashRepository['restoreFolder']>(),
    };
    foldersRepository = {
      markDeleted: vi.fn<FoldersRepository['markDeleted']>(),
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
    };
    defaultRetentionService = new DefaultRetentionService({
      getDefault: vi.fn(),
      updateDefault: vi.fn(),
    });
    canPermanentlyDeleteEntry = vi.spyOn(
      defaultRetentionService,
      'canPermanentlyDeleteEntry',
    );
    canPermanentlyDeleteEntry.mockResolvedValue(true);
    service = new TrashService(
      trashRepository,
      foldersRepository,
      defaultRetentionService,
    );
  });

  it('delegates trash listing to the repository', async () => {
    const items = { files: [], folders: [] };
    trashRepository.findDeleted.mockResolvedValue(items);

    await expect(service.getTrash()).resolves.toBe(items);
    expect(trashRepository.findDeleted).toHaveBeenCalledWith(null);
  });

  it('restores a root file without creating folders', async () => {
    const file = {
      id: 'file-id',
      folderId: null,
      originalLocation: null,
    } as File;
    trashRepository.findDeletedFile.mockResolvedValue(file);
    trashRepository.restoreFile.mockResolvedValue(file);

    await expect(service.restoreFile('file-id')).resolves.toBeUndefined();
    expect(trashRepository.restoreFile).toHaveBeenCalledWith('file-id', null);
    expect(foldersRepository.create).not.toHaveBeenCalled();
  });

  it('recreates a missing path before restoring a file', async () => {
    const file = {
      id: 'file-id',
      folderId: 'deleted-folder-id',
      originalLocation: 'Projects/Reports',
    } as File;
    trashRepository.findDeletedFile.mockResolvedValue(file);
    foldersRepository.findChildren
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    foldersRepository.create
      .mockResolvedValueOnce({
        id: 'projects-id',
        name: 'Projects',
      } as Folder)
      .mockResolvedValueOnce({
        id: 'reports-id',
        name: 'Reports',
      } as Folder);
    trashRepository.restoreFile.mockResolvedValue(file);

    await service.restoreFile('file-id');

    expect(trashRepository.restoreFile).toHaveBeenCalledWith(
      'file-id',
      'reports-id',
    );
  });

  it('restores a folder under an existing path', async () => {
    const folder = {
      id: 'folder-id',
      originalLocation: 'Projects',
    } as Folder;
    trashRepository.findDeletedFolder.mockResolvedValue(folder);
    foldersRepository.findChildren.mockResolvedValue([
      { id: 'projects-id', name: 'Projects' } as Folder,
    ]);
    trashRepository.restoreFolder.mockResolvedValue(folder);

    await service.restoreFolder('folder-id');

    expect(trashRepository.restoreFolder).toHaveBeenCalledWith(
      'folder-id',
      'projects-id',
    );
  });

  it('throws when the file is not in trash', async () => {
    trashRepository.findDeletedFile.mockResolvedValue(undefined);

    await expect(service.restoreFile('missing-file')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('permanently deletes a file from trash', async () => {
    const deletedAt = new Date('2026-01-01T00:00:00Z');
    trashRepository.findDeletedFile.mockResolvedValue({
      id: 'file-id',
      deletedAt,
    } as File);

    await expect(
      service.permanentlyDeleteFile('file-id'),
    ).resolves.toBeUndefined();
    expect(trashRepository.permanentlyDeleteFile).toHaveBeenCalledWith(
      'file-id',
    );
    expect(canPermanentlyDeleteEntry).toHaveBeenCalledWith(deletedAt);
  });

  it('permanently deletes a folder from trash', async () => {
    const deletedAt = new Date('2026-01-01T00:00:00Z');
    trashRepository.findDeletedFolder.mockResolvedValue({
      id: 'folder-id',
      deletedAt,
    } as Folder);

    await expect(
      service.permanentlyDeleteFolder('folder-id'),
    ).resolves.toBeUndefined();
    expect(trashRepository.permanentlyDeleteFolder).toHaveBeenCalledWith(
      'folder-id',
    );
    expect(canPermanentlyDeleteEntry).toHaveBeenCalledWith(deletedAt);
  });

  describe.each(['file', 'folder'] as const)(
    'permanent deletion of a %s',
    (kind) => {
      const entryId = 'entry-id';

      function setupEntry(deletedAt: Date | null) {
        if (kind === 'file') {
          trashRepository.findDeletedFile.mockResolvedValue({
            id: entryId,
            deletedAt,
          } as File);
        } else {
          trashRepository.findDeletedFolder.mockResolvedValue({
            id: entryId,
            deletedAt,
          } as Folder);
        }
      }

      function permanentlyDelete() {
        return kind === 'file'
          ? service.permanentlyDeleteFile(entryId)
          : service.permanentlyDeleteFolder(entryId);
      }

      function expectNoDeletion() {
        expect(trashRepository.permanentlyDeleteFile).not.toHaveBeenCalled();
        expect(trashRepository.permanentlyDeleteFolder).not.toHaveBeenCalled();
      }

      it('returns HTTP 403 and does not delete before retention expires', async () => {
        setupEntry(new Date());
        canPermanentlyDeleteEntry.mockResolvedValue(false);

        const error = await permanentlyDelete().catch(
          (error: unknown) => error,
        );

        expect(error).toBeInstanceOf(ForbiddenException);
        expect((error as ForbiddenException).getStatus()).toBe(403);
        expectNoDeletion();
      });

      it('rejects missing deletedAt without evaluating retention or deleting', async () => {
        setupEntry(null);

        await expect(permanentlyDelete()).rejects.toBeInstanceOf(
          InternalServerErrorException,
        );
        expect(canPermanentlyDeleteEntry).not.toHaveBeenCalled();
        expectNoDeletion();
      });

      it('rejects an entry absent from trash without deleting', async () => {
        await expect(permanentlyDelete()).rejects.toBeInstanceOf(
          NotFoundException,
        );
        expect(canPermanentlyDeleteEntry).not.toHaveBeenCalled();
        expectNoDeletion();
      });

      it('does not delete when retention lookup fails', async () => {
        setupEntry(new Date());
        const error = new InternalServerErrorException(
          'Default retention is not configured',
        );
        canPermanentlyDeleteEntry.mockRejectedValue(error);

        await expect(permanentlyDelete()).rejects.toBe(error);
        expectNoDeletion();
      });
    },
  );

  it('throws when the folder is not in trash', async () => {
    trashRepository.findDeletedFolder.mockResolvedValue(undefined);

    await expect(
      service.permanentlyDeleteFolder('missing-folder'),
    ).rejects.toThrow(NotFoundException);
  });
});
