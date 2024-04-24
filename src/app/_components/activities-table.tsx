"use client"

import * as React from "react"
import { DataTable } from "~/components/ui/data-table/data-table"
import { useDataTable } from "~/hooks/use-data-table"
import { type Activity } from "~/server/db/schema"
import { type getActivities } from "~/server/queries"
import { type DataTableFilterField } from "~/types"
import { getColumns } from "./activities-table-columns"

interface ActivitiesTableProps {
  activitiesPromise: ReturnType<typeof getActivities>
}

export function ActivitiesTable({ activitiesPromise }: ActivitiesTableProps) {
  const { data, pageCount } = React.use(activitiesPromise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Activity>[] = [
    { label: "Name", value: "name" }
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 10
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTable
        table={table}
      />
    </div>
  )
}
