import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { conn, db } from './server/db';

// This will run migrations on the database, skipping the ones already applied
// @ts-expect-error mode
await migrate(db, { migrationsFolder: './drizzle' });

// Don't forget to close the connection, otherwise the script will hang
await conn.end();
