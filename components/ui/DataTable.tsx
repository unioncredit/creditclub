import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, OnChangeFn } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  sorting: externalSorting,
  onSortingChange,
}: DataTableProps<TData, TValue>) => {
  // Use internal state if no external state is provided
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  
  // Choose between external and internal sorting
  const sorting = externalSorting || internalSorting;
  const handleSortingChange: OnChangeFn<SortingState> = onSortingChange || setInternalSorting;
  
  // Add debug logging
  console.log('DataTable rendering with:', { 
    dataLength: data.length, 
    columns: columns.length,
    sortingState: sorting 
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    onSortingChange: handleSortingChange,
    enableSorting: true,
    manualSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  console.log("DataTable rendering:", {
    data: data.length,
    columns: columns.length,
    sorting,
    visibleColumns: table.getVisibleLeafColumns().length
  });

  return (
    <div className="w-full">
      <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  // Check if column is sortable
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  
                  return (
                    <TableHead 
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${canSort ? 'cursor-pointer select-none' : ''}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className={
                        `flex items-center gap-1 ${header.column.columnDef.meta?.alignRight ? "justify-end" : "justify-start"}`
                      }>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        
                        {/* Show sort indicators */}
                        {canSort && (
                          <div className="inline-flex">
                            {isSorted === "asc" ? (
                              <ArrowUp className="h-4 w-4 text-black" />
                            ) : isSorted === "desc" ? (
                              <ArrowDown className="h-4 w-4 text-black" />
                            ) : (
                              <div className="h-4 w-4 text-gray-300 flex flex-col items-center">
                                <ArrowUp className="h-2 w-2" />
                                <ArrowDown className="h-2 w-2" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-b border-gray-200 
                    ${i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-white">
                <TableCell 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 10 && <DataTablePagination table={table} />}
    </div>
  )
}