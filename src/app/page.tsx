import { DataTableSkeleton } from "~/components/ui/data-table/data-table-skeleton";
import * as React from "react";
import { getActivities } from "~/server/queries";
import { ActivitiesTable } from "./_components/activities-table";

export default async function Home() {
  const activitiesPromise = getActivities();

  return (
    <React.Suspense fallback={
      <DataTableSkeleton
        columnCount={2}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
        shrinkZero
      />
    }>
      <ActivitiesTable activitiesPromise={activitiesPromise} />
    </React.Suspense>
  );
}
