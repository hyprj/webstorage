export type Folder = {
  id: string | null;
  parentId: string | null;
  name: string;
};

export type FolderGridRow = {
  folder: Folder;
  isExpanded: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  isLoading: boolean;
  isError: boolean;
  hasChildren: boolean | undefined;
  depth: number;
};
