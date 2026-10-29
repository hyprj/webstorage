import { DataGrid } from "../../components/DataGrid";
import type { FolderGridRow } from "./types";
import { useFoldersViewColumns } from "./useFoldersViewColumns";
import { useFoldersViewData } from "./useFoldersViewData";

export function FoldersView() {
  const { rows, isError, isLoading } = useFoldersViewData();
  const columns = useFoldersViewColumns();

  if (isError) {
    return <div>is error</div>;
  }

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  return (
    <div>
      /<div>same but via dataGrid</div>
      <DataGrid<FolderGridRow>
        columns={columns}
        data={rows}
        getRowKey={(row) => String(row.folder.id)}
      />
    </div>
  );
}
