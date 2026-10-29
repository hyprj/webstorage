import { AddFolderButton } from "../../components/AddFolderButton";
import { DeleteFolderButton } from "../../components/DeleteFolderButton";
import { FolderEntry } from "../../components/FolderEntry";
import type { Column } from "../../components/DataGrid/DataGrid";
import type { FolderGridRow } from "./types";

export function useFoldersViewColumns(): Column<FolderGridRow>[] {
  return [
    {
      id: "name",
      name: "Name",
      cell: (row: FolderGridRow) => (
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
      ),
    },
  ];
}
