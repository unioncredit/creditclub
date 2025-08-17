import { Table } from "@tanstack/react-table";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const nPages = Array.from(Array(table.getPageCount()), (_, i) => i + 1);
  const activePageIndex = table.getState().pagination.pageIndex;
  const numbers =
    table.getPageCount() > 4
      ? activePageIndex <= Math.round((table.getPageCount() / 2))
        ? [...nPages.slice(Math.max(0, activePageIndex - 1), activePageIndex + 1), "...", ...nPages.slice(-2)]
        : [...nPages.slice(0, 2), "...", ...nPages.slice(activePageIndex - 1, activePageIndex + 1)]
      : nPages;

  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-4 bg-white text-sm border-t border-gray-200">
      <div className="flex items-center space-x-2 text-gray-600">
        <span>Rows per page:</span>
        <select
          className="p-1 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <ShadowButton
          variant="text"
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </ShadowButton>

        <div className="flex items-center">
          {numbers.map((n, i) => (
            <ShadowButton
              key={i}
              variant="text"
              onClick={() => {
                if (typeof n === "number") {
                  table.setPageIndex(n - 1);
                }
              }}
              disabled={typeof n !== "number"}
              className={cn("px-3 py-1 mx-0.5 rounded border", {
                "bg-gray-100 border-gray-400 font-medium": activePageIndex + 1 === n,
                "border-transparent": activePageIndex + 1 !== n,
                "text-gray-500 cursor-default": typeof n !== "number",
                "hover:bg-gray-50": typeof n === "number" && activePageIndex + 1 !== n
              })}
            >
              {n}
            </ShadowButton>
          ))}
        </div>

        <ShadowButton
          variant="text"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </ShadowButton>
      </div>

      <div className="text-gray-600">
        Showing {table.getFilteredRowModel().rows.length > 0 ? 
          table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} to{" "}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{" "}
        of {table.getFilteredRowModel().rows.length} entries
      </div>
    </div>
  )
}