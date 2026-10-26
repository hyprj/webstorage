import { FolderEntry } from "../../components/FolderEntry";
import type { Column } from "../../components/DataGrid/DataGrid";
import type { FolderGridRow } from "./types";

export function useFoldersViewColumns(): Column<FolderGridRow>[] {
  return [
    {
      id: "name",
      name: "Name",
      cell: (row: FolderGridRow) => (
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
      ),
    },
  ];
}
