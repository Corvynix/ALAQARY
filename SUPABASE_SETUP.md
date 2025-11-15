# Supabase Database Setup Guide

This guide will help you set up all database tables for the Real Estate Conversion Funnel System on Supabase.

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com)
2. A new Supabase project created

## Step 1: Get Your Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, copy the **URI** connection string
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Or use the connection pooling string for better performance

## Step 2: Create the Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
6. You should see a success message confirming all tables were created

### Option B: Using Drizzle Kit (Alternative)

1. Create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   PORT=5000
   ```

2. Run the schema push command:
   ```bash
   npm run db:push
   ```

   Note: This will create tables based on your Drizzle schema but won't create the views. Use Option A for complete setup.

## Step 3: Verify Tables Were Created

1. In Supabase dashboard, go to **Table Editor**
2. You should see the following tables:
   - ✅ `users`
   - ✅ `properties`
   - ✅ `market_trends`
   - ✅ `leads`
   - ✅ `content`
   - ✅ `roi_calculator_usage`
   - ✅ `agents`
   - ✅ `user_behaviors`
   - ✅ `transactions`

## Step 4: Update Your Environment Variables

Create or update your `.env` file:

```env
# Supabase Database Connection
# Use the URI connection string (for direct connection) or Pooler connection (for connection pooling)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Server Port
PORT=5000

# Optional: Supabase API Keys (if you want to use Supabase Auth/Storage)
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_ANON_KEY=your-anon-key-here
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** 
- Replace `[YOUR-PASSWORD]` with your actual Supabase database password
- For **connection pooling** (recommended for production), use the pooler connection string format:
  ```
  postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:5432/postgres
  ```
- The current `server/db.ts` uses Neon serverless driver which works with Supabase's PostgreSQL connection
- If you encounter connection issues, you can use the alternative `server/db.supabase.ts` (requires installing `postgres-js`)

## Step 5: Test the Connection

Start your development server:

```bash
npm run dev
```

The server should start without database connection errors.

## Database Schema Overview

### Core Tables

- **users** - Admin/user accounts
- **properties** - Real estate listings with analytics fields
- **market_trends** - Market analysis data with demand tracking
- **leads** - Client leads with funnel stage tracking
- **content** - Blog posts and educational content

### Conversion Funnel Tables

- **agents** - Real estate consultants/agents with performance metrics
- **user_behaviors** - Tracks all user interactions and behaviors
- **transactions** - Completed purchases and deals

### Analytics Tables

- **roi_calculator_usage** - Tracks ROI calculator usage statistics

## Available Views

The schema includes helpful views for analytics:

1. **funnel_distribution** - Shows distribution of leads across funnel stages
2. **high_intent_leads** - Lists leads with high purchase probability
3. **agent_performance** - Summary of agent performance metrics

## Indexes Created

The following indexes are automatically created for optimal performance:

- `idx_leads_session_id` - Fast session lookups
- `idx_leads_funnel_stage` - Filter by funnel stage
- `idx_leads_phone` - Find leads by phone
- `idx_user_behaviors_session_id` - Session behavior tracking
- `idx_user_behaviors_lead_id` - Lead behavior history
- `idx_user_behaviors_behavior_type` - Filter by behavior type
- `idx_transactions_lead_id` - Lead transaction history
- `idx_transactions_property_id` - Property sales tracking
- `idx_transactions_agent_id` - Agent sales tracking

## Next Steps

1. **Seed Initial Data** (optional):
   - You can use the `server/seed.ts` file to add sample data
   - Or manually add data through Supabase Table Editor

2. **Set Up Row Level Security** (optional):
   - If you want to use Supabase Auth with RLS, uncomment the RLS policies in the SQL file
   - This adds an extra layer of security

3. **Configure API Access**:
   - The application uses the connection string directly
   - Ensure your DATABASE_URL has proper access permissions

## Using Alternative Database Connection (Optional)

If you prefer a standard PostgreSQL connection for Supabase instead of the Neon serverless driver:

1. Install the required package:
   ```bash
   npm install postgres
   ```

2. Replace `server/db.ts` with the contents of `server/db.supabase.ts`:
   ```bash
   cp server/db.supabase.ts server/db.ts
   ```

Note: The current setup with `@neondatabase/serverless` should work fine with Supabase. Only switch if you encounter specific compatibility issues.

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Verify your `DATABASE_URL` is correct
2. Check that your Supabase project is active
3. Ensure your IP is not blocked (check Supabase Network Restrictions)
4. Try using the connection pooler URL instead of direct connection
5. Verify your password doesn't contain special characters that need URL encoding (e.g., `@` should be `%40`)

### Missing Tables

If tables are missing:

1. Run the SQL file again in Supabase SQL Editor
2. Check for any error messages
3. Verify you have proper database permissions

### Permission Errors

If you get permission errors:

1. Ensure you're using the correct database role
2. Check Supabase database settings
3. Verify connection string includes correct credentials

## Support

For issues with:
- **Supabase**: Check Supabase documentation at https://supabase.com/docs
- **Database Schema**: Review `shared/schema.ts` for TypeScript definitions
- **Application**: Check server logs for detailed error messages

