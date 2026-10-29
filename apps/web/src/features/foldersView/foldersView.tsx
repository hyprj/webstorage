import { DataGrid } from "../../components/DataGrid";
import type { FolderContentRow } from "./types";
import { useFoldersViewColumns } from "./useFoldersViewColumns";
import { useFoldersViewData } from "./useFoldersViewData";

export function FoldersView() {
  const { rows, isError, isLoading, error } = useFoldersViewData();
  const columns = useFoldersViewColumns();

  if (isError) {
    return (
      <div role="alert" className="text-sm text-red-600">
        Failed to load folder contents: {error?.message}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading folder contents...</div>;
  }

  return (
    <div>
      /<div>same but via dataGrid</div>
      <DataGrid<FolderContentRow>
        columns={columns}
        data={rows}
        getRowKey={(row) =>
          row.kind === "folder"
            ? `folder-${row.folder.id}`
            : `file-${row.file.id}`
        }
      />
    </div>
  );
}
