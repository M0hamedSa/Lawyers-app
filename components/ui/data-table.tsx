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
  const labeledColumns = columns.filter((c) => c.header?.trim());
  const unlabeledColumns = columns.filter((c) => !c.header?.trim());

  return (
    <div className="overflow-hidden rounded-md border border-ink-100 dark:border-ink-700">
      {data.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-ink-700 dark:text-ink-400">{empty}</div>
      ) : (
        <>
          {/* Desktop / tablet: classic table */}
          <div className="hidden md:block md:overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100 text-sm dark:divide-ink-700">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-700 dark:bg-ink-800/80 dark:text-ink-300">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={cn("px-3 py-3 font-semibold text-start sm:px-4", column.className)}
                    >
                      {column.header || "\u00a0"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 bg-white dark:divide-ink-700 dark:bg-ink-900">
                {data.map((row) => (
                  <tr
                    key={getRowKey(row)}
                    className="hover:bg-ink-50/70 dark:hover:bg-ink-800/60"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("px-3 py-3 align-middle text-start sm:px-4", column.className)}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards, no horizontal scroll */}
          <div className="md:hidden">
            <ul className="divide-y divide-ink-100 dark:divide-ink-700">
              {data.map((row) => (
                <li
                  key={getRowKey(row)}
                  className="bg-white px-4 py-4 dark:bg-ink-900"
                >
                  <dl className="space-y-3">
                    {labeledColumns.map((col) => (
                      <div key={col.key} className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                          {col.header}
                        </dt>
                        <dd
                          className={cn(
                            "mt-1 text-sm leading-snug text-ink-900 dark:text-ink-100 break-words",
                            col.className,
                          )}
                        >
                          {col.cell(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {unlabeledColumns.length > 0 ? (
                    <div className="mt-4 space-y-2 border-t border-ink-100 pt-3 dark:border-ink-700">
                      {unlabeledColumns.map((col) => (
                        <div key={col.key} className="min-w-0 [&_a]:inline-flex [&_button]:w-full">
                          {col.cell(row)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
