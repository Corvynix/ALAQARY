# Netlify Deployment Guide

This guide will help you deploy the Real Estate Intelligence OS to Netlify.

## Prerequisites

1. A Netlify account (free tier works)
2. A Supabase database (or any PostgreSQL database)
3. Google AI API key for Gemini

## Step 1: Environment Variables

Set the following environment variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```
DATABASE_URL=postgresql://user:password@host:port/database
GOOGLE_AI_API_KEY=your_google_ai_api_key
NODE_ENV=production
PORT=8888
```

**Important Notes:**
- Use your Supabase connection string for `DATABASE_URL`
- For Supabase, use the connection pooling URL for better performance:
  ```
  postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:5432/postgres
  ```
- Never commit these values to git

## Step 2: Database Setup

1. Ensure your Supabase database schema is up to date:
   ```bash
   npm run db:push
   ```

2. Or manually run the SQL schema in Supabase SQL Editor

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Option B: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. In Netlify dashboard, click **Add new site** → **Import an existing project**
3. Connect your repository
4. Configure build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist/public`
5. Add environment variables (see Step 1)
6. Click **Deploy site**

### Option C: Deploy via Netlify UI

1. In Netlify dashboard, click **Add new site** → **Deploy manually**
2. Drag and drop the `dist` folder (after running `npm run build:netlify`)
3. Add environment variables in site settings

## Step 4: Verify Deployment

1. Check the health endpoint:
   ```
   https://your-site.netlify.app/health
   ```

2. Test the API:
   ```
   https://your-site.netlify.app/api/auth/me
   ```

3. Check Netlify function logs:
   - Go to **Functions** tab in Netlify dashboard
   - Check for any errors

## Step 5: Custom Domain (Optional)

1. Go to **Domain settings** in Netlify
2. Click **Add custom domain**
3. Follow the DNS configuration instructions
4. SSL certificate will be automatically provisioned

## Architecture on Netlify

### How It Works

- **Frontend**: Served as static files from `dist/public`
- **Backend**: Runs as Netlify serverless function at `/.netlify/functions/server`
- **Routing**: All requests (including API calls) are proxied to the serverless function
- **Database**: Connected via Supabase PostgreSQL

### Serverless Function Limits

**Free Tier:**
- 125,000 requests/month
- 100 hours execution time/month
- 10-second timeout per request

**Pro Tier:**
- 1,000,000 requests/month
- 1,000 hours execution time/month
- 26-second timeout per request

**Note**: For production workloads, consider upgrading to Pro tier or using a dedicated server.

## Troubleshooting

### Function Timeout Errors

If you see timeout errors:
1. Upgrade to Netlify Pro (26-second timeout)
2. Optimize slow database queries
3. Implement caching for frequently accessed data
4. Consider splitting heavy operations into background jobs

### Database Connection Issues

1. Verify `DATABASE_URL` is correct in environment variables
2. Check Supabase connection pooling settings
3. Ensure your IP is whitelisted in Supabase (if required)
4. Check Netlify function logs for connection errors

### Build Failures

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (set to 20 in `netlify.toml`)
4. Check for TypeScript errors: `npm run check`

### CORS Issues

1. Verify `FRONTEND_URL` environment variable matches your Netlify domain
2. Check CORS configuration in `server/middleware/security.ts`
3. Ensure credentials are included in API requests

## Performance Optimization

### For Netlify Serverless Functions

1. **Connection Pooling**: Use Supabase connection pooling URL
2. **Cold Starts**: Functions may have cold start delays (1-2 seconds)
3. **Caching**: Implement Redis or in-memory caching for frequently accessed data
4. **Database Indexes**: Ensure proper indexes on frequently queried columns

### Monitoring

1. **Netlify Analytics**: Enable in site settings
2. **Function Logs**: Monitor in Functions tab
3. **Error Tracking**: Set up error tracking service (Sentry, etc.)
4. **Health Checks**: Monitor `/health` endpoint

## Scaling Considerations

For high-traffic applications:

1. **Upgrade to Netlify Pro**: Higher limits and better performance
2. **Use Edge Functions**: For simple operations, use Netlify Edge Functions
3. **Database Optimization**: Use read replicas, connection pooling
4. **CDN**: Netlify automatically provides CDN for static assets
5. **Consider Dedicated Server**: For very high traffic, consider VPS or dedicated hosting

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=your_dev_database_url
```

### Production
```env
NODE_ENV=production
DATABASE_URL=your_prod_database_url
```

## Security Checklist

- ✅ Environment variables are set in Netlify (not in code)
- ✅ Database credentials are secure
- ✅ API keys are protected
- ✅ CORS is properly configured
- ✅ Rate limiting is enabled
- ✅ Security headers are set
- ✅ HTTPS is enforced (automatic on Netlify)

## Support

For issues:
1. Check Netlify function logs
2. Review build logs
3. Test locally: `npm run dev`
4. Check database connectivity
5. Verify environment variables

## Next Steps

After deployment:
1. Set up monitoring and alerts
2. Configure custom domain
3. Set up CI/CD for automatic deployments
4. Implement error tracking
5. Set up backup strategy for database

