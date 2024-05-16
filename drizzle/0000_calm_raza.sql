CREATE TABLE IF NOT EXISTS "fit_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "fit_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(256),
	"distance" double precision,
	"movingTime" integer,
	"elapsedTime" integer,
	"totalElevationGain" double precision,
	"type" varchar(256),
	"shortType" varchar(256),
	"workoutType" integer,
	"stravaId" varchar NOT NULL,
	"startDate" varchar(256),
	"startDateLocal" varchar(256),
	"timezone" varchar(256),
	"utcOffset" integer,
	"locationCity" varchar(256),
	"locationState" varchar(256),
	"locationCountry" varchar(256),
	"achievementCount" integer,
	"kudosCount" integer,
	"commentCount" integer,
	"athleteCount" integer,
	"photoCount" integer,
	"map" jsonb,
	"trainer" boolean,
	"commute" boolean,
	"manual" boolean,
	"private" boolean,
	"averageSpeed" double precision,
	"maxSpeed" double precision,
	"hasHeartrate" boolean,
	"elevHigh" double precision,
	"elevLow" double precision,
	"calories" double precision,
	CONSTRAINT "fit_activity_stravaId_unique" UNIQUE("stravaId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_lap" (
	"id" serial PRIMARY KEY NOT NULL,
	"activityId" integer NOT NULL,
	"stravaId" varchar NOT NULL,
	"name" varchar(256),
	"elapsedTime" integer,
	"movingTime" integer,
	"startDate" varchar(256),
	"startDateLocal" varchar(256),
	"distance" double precision,
	"averageSpeed" double precision,
	"maxSpeed" double precision,
	"lapIndex" integer,
	"split" integer,
	"startIndex" integer,
	"endIndex" integer,
	"totalElevationGain" double precision,
	"deviceWatts" boolean,
	"paceZone" integer,
	CONSTRAINT "fit_lap_stravaId_unique" UNIQUE("stravaId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_splitMetric" (
	"id" serial PRIMARY KEY NOT NULL,
	"activityId" integer NOT NULL,
	"distance" double precision,
	"elapsedTime" integer,
	"movingTime" integer,
	"split" integer,
	"averageSpeed" double precision,
	"averageGradeAdjustedSpeed" double precision,
	"paceZone" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_splitStandard" (
	"id" serial PRIMARY KEY NOT NULL,
	"activityId" integer NOT NULL,
	"distance" double precision,
	"elapsedTime" integer,
	"elevationDifference" double precision,
	"movingTime" integer,
	"split" integer,
	"averageSpeed" double precision,
	"averageGradeAdjustedSpeed" double precision,
	"paceZone" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"athelteId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fit_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "fit_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_account" ADD CONSTRAINT "fit_account_userId_fit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_activity" ADD CONSTRAINT "fit_activity_userId_fit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_lap" ADD CONSTRAINT "fit_lap_activityId_fit_activity_id_fk" FOREIGN KEY ("activityId") REFERENCES "public"."fit_activity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_session" ADD CONSTRAINT "fit_session_userId_fit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_splitMetric" ADD CONSTRAINT "fit_splitMetric_activityId_fit_activity_id_fk" FOREIGN KEY ("activityId") REFERENCES "public"."fit_activity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fit_splitStandard" ADD CONSTRAINT "fit_splitStandard_activityId_fit_activity_id_fk" FOREIGN KEY ("activityId") REFERENCES "public"."fit_activity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "fit_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "fit_session" ("userId");