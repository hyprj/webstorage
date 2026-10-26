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
};

export function DataGrid<T>({ data, columns, getRowKey }: DataGridProps<T>) {
  console.log("datagrid rerender");
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          {columns.map((column) => (
            <th key={column.id} className="px-3 py-2 font-medium">
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={getRowKey(row)}
            className="border-b border-slate-100 last:border-0"
          >
            {columns.map((column) => (
              <td key={column.id} className="px-3 py-2">
                {column.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
