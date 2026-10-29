import type { Key, ReactNode } from "react";

export type Column<T> = {
  id: string;
  name: string;
  cell: (row: T) => ReactNode;
};

export type DataGridProps<T> = {
  data: readonly T[];
  columns: readonly Column<T>[];
  getRowKey: (row: T) => Key;
  emptyState?: ReactNode;
};

export function DataGrid<T>({
  data,
  columns,
  getRowKey,
  emptyState,
}: DataGridProps<T>) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border text-muted">
          {columns.map((column) => (
            <th key={column.id} className="px-3 py-3 font-medium">
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && emptyState ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-3 py-12 text-center text-sm text-muted"
            >
              {emptyState}
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border/70 last:border-0"
            >
              {columns.map((column) => (
                <td key={column.id} className="px-3 py-2">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
