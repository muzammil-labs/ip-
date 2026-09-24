import type { ReactNode } from "react";
import EmptyState from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Rendered as the card title on the mobile stacked-card layout. Defaults to the first column. */
  primary?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage: string;
  /** Filter bar (Segmented plus a search Field) rendered above the table. */
  filterBar?: ReactNode;
}

/** Sticky header, row-hover wash, dividers between rows only. Collapses to stacked cards under 768px. */
export default function DataTable<T>({ columns, rows, rowKey, onRowClick, emptyMessage, filterBar }: DataTableProps<T>) {
  const primaryKey = columns.find((c) => c.primary)?.key ?? columns[0]?.key;

  return (
    <div>
      {filterBar && <div className="mb-4 flex flex-wrap items-center gap-2">{filterBar}</div>}

      {rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <div className="hidden overflow-x-auto rounded-container border border-line sm:block">
            <table className="w-full border-collapse text-small">
              <thead className="sticky top-0 bg-surface">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="border-b border-line px-4 py-2.5 text-left font-semibold text-ink-3">
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? "cursor-pointer hover:bg-wash" : ""}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-2.5 text-ink-2">
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {rows.map((row) => (
              <div
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`rounded-container border border-line bg-surface p-4 ${onRowClick ? "cursor-pointer active:bg-wash" : ""}`}
              >
                {columns.map((c) => (
                  <div key={c.key} className={c.key === primaryKey ? "text-body font-semibold text-ink" : "mt-1 text-small text-ink-2"}>
                    {c.key !== primaryKey && <span className="mr-1.5 text-ink-3">{c.header}:</span>}
                    {c.render(row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
