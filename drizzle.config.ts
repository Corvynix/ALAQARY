import { defineConfig } from "drizzle-kit";

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

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
