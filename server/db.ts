// Load environment variables first
import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?\n" +
    "Please check your .env file in the project root and ensure DATABASE_URL is set correctly.\n" +
    "Example: DATABASE_URL=postgresql://postgres:password@host:port/database"
  );
}

// Disable prepared statements if using Supabase connection pooling
// Supabase connection pooling doesn't support prepared statements
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  prepare: false, // Disable for Supabase connection pooling
  max: 10, // Connection pool size
});

export const db = drizzle(client, { schema });
