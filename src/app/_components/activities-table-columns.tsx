"use client"

import * as React from "react"
import { type Activity } from "../../server/db/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header"

export function getColumns(): ColumnDef<Activity>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("name")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "movingTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Moving Time" />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("movingTime")}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">hello</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="capitalize">hello</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => cell.getValue(),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}
