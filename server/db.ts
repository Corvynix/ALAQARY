import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate Supabase environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to provision a Supabase database?",
  );
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_ANON_KEY must be set. Did you forget to provision a Supabase database?",
  );
}

// Validate DATABASE_URL (should be Supabase's direct PostgreSQL connection string)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. This should be your Supabase PostgreSQL connection string. " +
    "You can find it in your Supabase project settings under Database > Connection string.",
  );
}

// Validate that DATABASE_URL is from Supabase
const databaseUrl = process.env.DATABASE_URL;
const isSupabaseUrl = 
  databaseUrl.includes('supabase.com') || 
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('pooler.supabase.com');

if (!isSupabaseUrl) {
  throw new Error(
    "DATABASE_URL must be a Supabase connection string. " +
    "The connection string should contain 'supabase.com' or 'supabase.co'. " +
    "Please ensure you are using Supabase as your only database provider.",
  );
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a connection pool using Supabase's PostgreSQL connection string
// This is the direct PostgreSQL connection string from Supabase, not the REST API URL
const pool = new Pool({
  connectionString: databaseUrl,
  // Add connection pool settings for better performance
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
