export type Folder = {
  id: string | null;
  parentId: string | null;
  name: string;
};

export type FolderGridRow = {
  kind: "folder";
  folder: Folder;
  isExpanded: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  isLoading: boolean;
  isError: boolean;
  hasChildren: boolean | undefined;
  depth: number;
};

export type FileMetadata = {
  id: string;
  folderId: string | null;
  name: string;
  contentType: string;
  size: number;
  createdAt: string;
};

export type FileGridRow = {
  kind: "file";
  file: FileMetadata;
  depth: number;
};

export type FolderContentRow = FolderGridRow | FileGridRow;
