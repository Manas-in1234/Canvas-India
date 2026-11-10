"use client";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  searchText?: (row: T) => string;
}
function searchable(value: unknown): string {
  if (value == null) return "";
  if (typeof value !== "object") return String(value);
  return Object.entries(value)
    .filter(
      ([key]) =>
        !/password|secret|token|svgPath|previewUrl|contentBytes/i.test(key),
    )
    .map(([, item]) => searchable(item))
    .join(" ");
}
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  pageSize = 20,
  emptyMessage = "No records yet.",
  searchText,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0),
    [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      data.filter((row) =>
        (searchText ? searchText(row) : searchable(row))
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [data, search, searchText],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1),
    pageData = filtered.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize,
    );
  return (
    <div className="table-panel">
      <div className="table-toolbar">
        <label className="table-search">
          <Search size={15} />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search records…"
            aria-label="Search table records"
          />
        </label>
        <span className="table-result-count">
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
          {search && ` of ${data.length}`}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!pageData.length ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 text-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <SearchX size={25} strokeWidth={1.4} />
                  <span>
                    {search ? "No records match your search." : emptyMessage}
                  </span>
                  {search && (
                    <button
                      className="text-xs text-primary underline"
                      onClick={() => {
                        setSearch("");
                        setPage(0);
                      }}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pageData.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className={
                  onRowClick ? "cursor-pointer hover:bg-[#f5f8fd]" : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (
                    onRowClick &&
                    (e.key === "Enter" || e.key === " ") &&
                    e.target === e.currentTarget
                  ) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.header}>{col.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="table-pagination">
        <span>
          {filtered.length
            ? `Showing ${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, filtered.length)} of ${filtered.length}`
            : "No records to display"}
        </span>
        <div className="flex items-center gap-3">
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous page"
            disabled={!currentPage}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next page"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
