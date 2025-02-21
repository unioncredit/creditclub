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
    <div className="flex items-center justify-between space-x-1 py-2">
      <ShadowButton
        variant="text"
        size="small"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<-'}
      </ShadowButton>

      <div>
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
            className={cn("text-muted-foreground", {
              "text-black underline": activePageIndex + 1 === n,
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
      >
        {'->'}
      </ShadowButton>
    </div>
  )
}