import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  empty: string;
  getRowKey: (row: T) => string;
};

export function DataTable<T>({ columns, data, empty, getRowKey }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-md border border-ink-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-100 text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-700">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn("px-4 py-3 font-semibold text-start", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-ink-700" colSpan={columns.length}>
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={getRowKey(row)} className="hover:bg-ink-50/70">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-3 align-middle text-start", column.className)}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
