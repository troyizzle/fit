import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  doublePrecision,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fit_${name}`);

export const activities = createTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    name: varchar("name", { length: 256 }),
    distance: doublePrecision("distance"),
    movingTime: integer("movingTime"),
    elapsedTime: integer("elapsedTime"),
    totalElevationGain: doublePrecision("totalElevationGain"),
    type: varchar("type", { length: 256 }),
    shortType: varchar("shortType", { length: 256 }),
    workoutType: integer("workoutType"),
    stravaId: varchar("stravaId").notNull().unique(),
    startDate: varchar("startDate", { length: 256 }),
    startDateLocal: varchar("startDateLocal", { length: 256 }),
    timezone: varchar("timezone", { length: 256 }),
    utcOffset: integer("utcOffset"),
    locationCity: varchar("locationCity", { length: 256 }),
    locationState: varchar("locationState", { length: 256 }),
    locationCountry: varchar("locationCountry", { length: 256 }),
    achievementCount: integer("achievementCount"),
    kudosCount: integer("kudosCount"),
    commentCount: integer("commentCount"),
    athleteCount: integer("athleteCount"),
    photoCount: integer("photoCount"),
    map: jsonb("map"),
    trainer: boolean("trainer"),
    commute: boolean("commute"),
    manual: boolean("manual"),
    private: boolean("private"),
    averageSpeed: doublePrecision("averageSpeed"),
    maxSpeed: doublePrecision("maxSpeed"),
    hasHeartrate: boolean("hasHeartrate"),
    elevHigh: doublePrecision("elevHigh"),
    elevLow: doublePrecision("elevLow"),
    calories: doublePrecision("calories"),
  }
)

export const splitMetrics = createTable(
  "splitMetric",
  {
    id: serial("id").primaryKey(),
    activityId: integer("activityId").notNull().references(() => activities.id),
    distance: doublePrecision("distance"),
    elapsedTime: integer("elapsedTime"),
    movingTime: integer("movingTime"),
    split: integer("split"),
    averageSpeed: doublePrecision("averageSpeed"),
    averageGradeAdjustedSpeed: doublePrecision("averageGradeAdjustedSpeed"),
    paceZone: integer("paceZone"),
  }
)

export const splitStandards = createTable(
  "splitStandard",
  {
    id: serial("id").primaryKey(),
    activityId: integer("activityId").notNull().references(() => activities.id),
    distance: doublePrecision("distance"),
    elapsedTime: integer("elapsedTime"),
    elevationDifference: doublePrecision("elevationDifference"),
    movingTime: integer("movingTime"),
    split: integer("split"),
    averageSpeed: doublePrecision("averageSpeed"),
    averageGradeAdjustedSpeed: doublePrecision("averageGradeAdjustedSpeed"),
    paceZone: integer("paceZone"),
  }
)

export const laps = createTable(
  "lap",
  {
    id: serial("id").primaryKey(),
    activityId: integer("activityId").notNull().references(() => activities.id),
    stravaId: varchar("stravaId").notNull().unique(),
    name: varchar("name", { length: 256 }),
    elapsedTime: integer("elapsedTime"),
    movingTime: integer("movingTime"),
    startDate: varchar("startDate", { length: 256 }),
    startDateLocal: varchar("startDateLocal", { length: 256 }),
    distance: doublePrecision("distance"),
    averageSpeed: doublePrecision("averageSpeed"),
    maxSpeed: doublePrecision("maxSpeed"),
    lapIndex: integer("lapIndex"),
    split: integer("split"),
    startIndex: integer("startIndex"),
    endIndex: integer("endIndex"),
    totalElevationGain: doublePrecision("totalElevationGain"),
    deviceWatts: boolean("deviceWatts"),
    paceZone: integer("paceZone"),
  }
)

export const activityRelations = relations(activities, ({ many }) => ({
  splits: many(splitMetrics),
  standards: many(splitStandards),
  laps: many(laps),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  athelteId: integer("athelteId"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  activities: many(activities),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type Activity = typeof activities.$inferSelect;
