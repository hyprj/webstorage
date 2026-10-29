import { DataGrid } from "../../components/DataGrid";
import type { Column } from "../../components/DataGrid/DataGrid";

type TrashRow = {
  id: string;
};

const columns: Column<TrashRow>[] = [
  { id: "name", name: "Name", cell: () => null },
  { id: "type", name: "Type", cell: () => null },
  { id: "size", name: "Size", cell: () => null },
  { id: "deleted", name: "Deleted", cell: () => null },
];

export function TrashView() {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface">
      <DataGrid<TrashRow>
        columns={columns}
        data={[]}
        getRowKey={(row) => row.id}
        emptyState="Trash is empty. Deleted files and folders will appear here."
      />
    </div>
  );
}
