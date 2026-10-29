import { AddFolderButton } from "../../components/AddFolderButton";
import { DeleteFolderButton } from "../../components/DeleteFolderButton";
import { FileEntry } from "../../components/FileEntry";
import { FolderEntry } from "../../components/FolderEntry";
import type { Column } from "../../components/DataGrid/DataGrid";
import type { FolderContentRow } from "./types";

function formatFileSize(size: number): string {
  if (size === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );
  const value = size / 1024 ** unitIndex;

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function useFoldersViewColumns(): Column<FolderContentRow>[] {
  return [
    {
      id: "name",
      name: "Name",
      cell: (row: FolderContentRow) =>
        row.kind === "folder" ? (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <FolderEntry
                folder={row.folder}
                isExpanded={row.isExpanded}
                onExpand={row.onExpand}
                onClose={row.onClose}
                isLoading={row.isLoading}
                isError={row.isError}
                hasChildren={row.hasChildren}
                depth={row.depth}
              />
            </div>
            <AddFolderButton folder={row.folder} />
            <DeleteFolderButton folder={row.folder} />
          </div>
        ) : (
          <FileEntry file={row.file} depth={row.depth} />
        ),
    },
    {
      id: "type",
      name: "Type",
      cell: (row: FolderContentRow) =>
        row.kind === "file" ? row.file.contentType : null,
    },
    {
      id: "size",
      name: "Size",
      cell: (row: FolderContentRow) =>
        row.kind === "file" ? formatFileSize(row.file.size) : null,
    },
    {
      id: "created",
      name: "Created",
      cell: (row: FolderContentRow) =>
        row.kind === "file"
          ? new Date(row.file.createdAt).toLocaleDateString()
          : null,
    },
  ];
}
