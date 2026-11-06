import type { FileMetadata, Folder } from "../features/foldersView/types";
import type { TrashResponse } from "../features/trashView/api";
import type { DefaultDataRetention } from "../features/dataRetention/api";

type MockFolder = Omit<Folder, "id"> & { id: string; deleted: boolean };
type MockFile = FileMetadata & { deleted: boolean };

const folders: MockFolder[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    parentId: null,
    name: "Documents",
    deleted: false,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    parentId: null,
    name: "Images",
    deleted: false,
  },
];

const files: MockFile[] = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    folderId: "11111111-1111-4111-8111-111111111111",
    name: "Readme.txt",
    contentType: "text/plain",
    size: 1024,
    createdAt: new Date().toISOString(),
    deleted: false,
  },
];

let defaultDataRetention: DefaultDataRetention = { time: "1h" };

export function getDefaultDataRetention(): DefaultDataRetention {
  return defaultDataRetention;
}

export function setDefaultDataRetention(
  value: DefaultDataRetention,
): DefaultDataRetention {
  defaultDataRetention = value;
  return defaultDataRetention;
}

export function listFolders(parentId: string | null): Folder[] {
  return folders
    .filter((folder) => !folder.deleted && folder.parentId === parentId)
    .map(({ deleted: _deleted, ...folder }) => folder);
}

export function listFiles(folderId: string | null): FileMetadata[] {
  return files
    .filter((file) => !file.deleted && file.folderId === folderId)
    .map(({ deleted: _deleted, ...file }) => file);
}

export function hasActiveFolder(id: string): boolean {
  return folders.some((folder) => folder.id === id && !folder.deleted);
}

export function createFolder(name: string, parentId: string | null): Folder {
  const folder: MockFolder = {
    id: crypto.randomUUID(),
    parentId,
    name,
    deleted: false,
  };
  folders.push(folder);
  return toFolder(folder);
}

export function createFile(
  name: string,
  contentType: string,
  size: number,
  folderId: string | null,
): FileMetadata {
  const file: MockFile = {
    id: crypto.randomUUID(),
    folderId,
    name,
    contentType,
    size,
    createdAt: new Date().toISOString(),
    deleted: false,
  };
  files.push(file);
  return toFile(file);
}

export function moveFileToTrash(id: string): boolean {
  const file = files.find((item) => item.id === id);
  if (!file) {
    return false;
  }
  file.deleted = true;
  return true;
}

export function moveFolderToTrash(id: string): boolean {
  const folder = folders.find((item) => item.id === id);
  if (!folder) {
    return false;
  }

  const deletedIds = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of folders) {
      if (candidate.parentId && deletedIds.has(candidate.parentId)) {
        changed = !deletedIds.has(candidate.id) || changed;
        deletedIds.add(candidate.id);
      }
    }
  }

  for (const candidate of folders) {
    if (deletedIds.has(candidate.id)) {
      candidate.deleted = true;
    }
  }
  for (const file of files) {
    if (file.folderId && deletedIds.has(file.folderId)) {
      file.deleted = true;
    }
  }
  return true;
}

export function listTrash(): TrashResponse {
  return {
    files: files
      .filter((file) => file.deleted)
      .map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        originalLocation: null,
      })),
    folders: folders
      .filter((folder) => folder.deleted)
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        originalLocation: null,
      })),
  };
}

export function restoreFile(id: string): boolean {
  const file = files.find((item) => item.id === id && item.deleted);
  if (!file) {
    return false;
  }
  file.deleted = false;
  return true;
}

export function restoreFolder(id: string): boolean {
  const folder = folders.find((item) => item.id === id && item.deleted);
  if (!folder) {
    return false;
  }
  const restoredIds = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of folders) {
      if (candidate.parentId && restoredIds.has(candidate.parentId)) {
        changed = !restoredIds.has(candidate.id) || changed;
        restoredIds.add(candidate.id);
      }
    }
  }
  for (const candidate of folders) {
    if (restoredIds.has(candidate.id)) {
      candidate.deleted = false;
    }
  }
  for (const file of files) {
    if (file.folderId && restoredIds.has(file.folderId)) {
      file.deleted = false;
    }
  }
  return true;
}

export function permanentlyDeleteFile(id: string): boolean {
  const index = files.findIndex((file) => file.id === id && file.deleted);
  if (index === -1) {
    return false;
  }
  files.splice(index, 1);
  return true;
}

export function permanentlyDeleteFolder(id: string): boolean {
  const folderIds = new Set<string>();
  const folder = folders.find((item) => item.id === id && item.deleted);
  if (!folder) {
    return false;
  }
  folderIds.add(id);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of folders) {
      if (candidate.parentId && folderIds.has(candidate.parentId)) {
        changed = !folderIds.has(candidate.id) || changed;
        folderIds.add(candidate.id);
      }
    }
  }
  for (let index = folders.length - 1; index >= 0; index -= 1) {
    if (folderIds.has(folders[index].id)) {
      folders.splice(index, 1);
    }
  }
  for (let index = files.length - 1; index >= 0; index -= 1) {
    const folderId = files[index].folderId;
    if (folderId && folderIds.has(folderId)) {
      files.splice(index, 1);
    }
  }
  return true;
}

function toFolder({ deleted: _deleted, ...folder }: MockFolder): Folder {
  return folder;
}

function toFile({ deleted: _deleted, ...file }: MockFile): FileMetadata {
  return file;
}
