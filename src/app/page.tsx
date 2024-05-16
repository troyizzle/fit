import * as React from "react";
import { getActivities } from "~/server/queries";

export default async function Home() {
  const activities = await getActivities();

  return (
    <div>
      activities count: {activities.pageCount}
      {activities.data.map((activity) => (
        <div key={activity.id}>{JSON.stringify(activity)}</div>
      ))}
    </div>
  );
}
