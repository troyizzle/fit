import 'server-only'

import { db } from './db'
import { accounts, activities, laps, users } from './db/schema'
import { count, eq } from 'drizzle-orm'
import strava from "strava-v3"
import fs from 'fs'

export async function deleteActivity({ stravaId }: { stravaId: string }) {
  await db.delete(activities).where(eq(activities.stravaId, stravaId));
}
type lapType = {
  id: string,
  activityId: number,
  stravaId: number,
  name: string,
  elapsed_time: number,
  moving_time: number,
  start_date: string,
  start_date_local: string,
  distance: number,
  average_speed: number,
  max_speed: number,
  split: number,
  start_index: number,
  end_index: number,
  total_elevation_gain: number,
  device_watts: boolean,
  pace_zone: number,
}

export async function createActivity({ object_id, owner_id }: {
  object_id: number,
  object_type: string,
  owner_id: number,
}) {
  const activityId = object_id
  console.log({ owner_id })

  const user = await db.query.users.findFirst({
    where: eq(users.athelteId, owner_id),
    with: {
      accounts: {
        where: eq(accounts.provider, 'strava')
      }
    }
  })

  const accessToken = user?.accounts[0]?.access_token

  console.log({ accessToken })

  if (!accessToken) {
    return Response.json({ status: 404 })
  }

  strava.client(accessToken)

  const activity = await strava.activities.get({
    id: activityId,
  })

  fs.writeFileSync('activity.json', JSON.stringify(activity, null, 2))

  await db.transaction(async (tx) => {
    const newActivity = await tx.insert(activities).values({
      name: activity.name,
      // @ts-expect-error - map is not defined in the type
      map: activity.map ?? {},
      type: activity.sport_type,
      sport: activity.sport_type,
      manual: activity.manual,
      stravaId: +activity.id,
      commute: activity.commute,
      elevLow: activity.elev_low,
      elevHigh: activity.elev_high,
      startDate: activity.start_date,
      startDateLocal: activity.start_date_local,
      timezone: activity.timezone,
      utcOffset: activity.utc_offset,
      locationCity: activity.location_city,
      locationState: activity.location_state,
      locationCountry: activity.location_country,
      achievementCount: activity.achievement_count,
      kudosCount: activity.kudos_count,
      commentCount: activity.comment_count,
      athleteCount: activity.athlete_count,
      photoCount: activity.photo_count,
      averageSpeed: activity.average_speed,
      maxSpeed: activity.max_speed,
      // @ts-expect-error - average_cadence is not defined in the type
      hasHeartrate: activity.has_heartrate as string,
      calories: activity.calories,
      movingTime: activity.moving_time,
      elapsedTime: activity.elapsed_time,
      totalElevationGain: activity.total_elevation_gain,
      trainer: activity.trainer,
      private: activity.private,
      userId: user.id,
    }).returning({ activityId: activities.id })

    const activityId = newActivity[0]?.activityId

    if (!activityId) {
      return
    }

    // @ts-expect-error - laps is not defined in the type
    const activityLaps = activity.laps as lapType[]

    for (const lap of activityLaps) {
      await tx.insert(laps).values({
        activityId,
        stravaId: lap.id,
        name: lap.name,
        elapsedTime: lap.elapsed_time,
        movingTime: lap.moving_time,
        startDate: lap.start_date,
        startDateLocal: lap.start_date_local,
        distance: lap.distance,
        averageSpeed: lap.average_speed,
        maxSpeed: lap.max_speed,
        split: lap.split,
        startIndex: lap.start_index,
        endIndex: lap.end_index,
        totalElevationGain: lap.total_elevation_gain,
        deviceWatts: lap.device_watts,
        paceZone: lap.pace_zone,
      })
    }
  })
}

export async function getActivities() {
  try {
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(activities)

      const total = await tx
        .select({
          count: count()
        })
        .from(activities)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total
      }
    })

    return { data, pageCount: Math.ceil(total / 10) }
  } catch (error) {
    console.error(error)
    return { data: [], pageCount: 0 }
  }
}
