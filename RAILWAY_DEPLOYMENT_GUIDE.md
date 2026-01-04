# Railway Backend Deployment Guide

This guide will walk you through deploying your Express.js backend to Railway.

## Prerequisites

- GitHub repository for this project
- Railway account (sign up at [railway.app](https://railway.app))
- All required API keys (Supabase, Stripe, Resend, etc.)

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `eraya-wellness-travels`
5. Railway will detect the project and start setting up

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a PostgreSQL database
3. The `DATABASE_URL` environment variable will be automatically added to your service

## Step 3: Configure Environment Variables

1. Click on your service (not the database)
2. Go to the **"Variables"** tab
3. Click **"Raw Editor"** for easier bulk input
4. Copy and paste the environment variables below, replacing placeholder values with your actual values:

```bash
# Node Environment
NODE_ENV=production

# Port (Railway will provide this automatically, but you can set a default)
PORT=8080

# JWT Authentication
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=7d

# Frontend/CORS Configuration (Update after Vercel deployment)
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Supabase (for Google OAuth)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=erayawellnesstravels@gmail.com

# Admin Configuration
ADMIN_EMAIL=erayawellnesstravels@gmail.com

# Payment (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# AI Chat (Optional - for chatbot functionality)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Ping Message (Optional)
PING_MESSAGE=ping pong
```

4. Click **"Update Variables"** to save

> **Note**: The `DATABASE_URL` is automatically set by Railway when you add the PostgreSQL database. Don't override it.

## Step 4: Deploy to Railway

1. Railway will automatically deploy your app when:
   - You push to your main/master branch on GitHub
   - You change environment variables
   - You manually trigger a deployment

2. To manually trigger deployment:
   - Go to **"Deployments"** tab
   - Click **"Deploy"**

3. Monitor the deployment logs:
   - Click on the active deployment
   - Watch the build and deployment logs
   - Look for "Server started successfully" message

## Step 5: Get Your Railway URL

1. Once deployment is successful, go to the **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** to get a public URL
4. Your Railway URL will look like: `https://eraya-wellness-travels-production.up.railway.app`
5. **Save this URL** - you'll need it for the next steps

## Step 6: Update CORS Configuration

Now that you have your Railway URL, update the CORS settings:

1. Go back to **"Variables"** tab
2. Update these variables with your actual Vercel URL:
   ```bash
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
   ```
3. If you have multiple domains (e.g., custom domain + vercel domain), use comma-separated values:
   ```bash
   ALLOWED_ORIGINS=https://erayawellnesstravels.com,https://your-app.vercel.app
   ```

## Step 7: Update Vercel Frontend Configuration

1. Go to [vercel.com](https://vercel.com) and open your project
2. Navigate to **Settings** → **Environment Variables**
3. Add or update the following variable:
   ```bash
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
4. Click **"Save"**
5. Go to **"Deployments"** tab and trigger a new deployment (or just push a commit to main)

## Step 8: Update Stripe Webhook URL

Since your backend URL has changed, update the Stripe webhook:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Find your existing webhook or create a new one
4. Set the endpoint URL to: `https://your-railway-url.up.railway.app/api/stripe-webhook`
5. Ensure the event `checkout.session.completed` is selected
6. Copy the **Signing Secret**
7. Update `STRIPE_WEBHOOK_SECRET` in Railway with this new secret

## Step 9: Verify Deployment

Test your backend deployment:

### Health Check
```bash
curl https://your-railway-url.up.railway.app/api/ping
```
Expected response: `{"message":"ping pong"}`

### Tours Endpoint
```bash
curl https://your-railway-url.up.railway.app/api/tours
```
Expected: JSON array of tours

### From Your Frontend
1. Visit your Vercel site
2. Open browser developer console (F12)
3. Check Network tab for API calls
4. Verify no CORS errors
5. Test Google OAuth login
6. Test viewing tours/treks
7. Test contact form submission

## Troubleshooting

### Deployment Failed
- Check Railway deployment logs for errors
- Ensure all environment variables are set correctly
- Verify DATABASE_URL is set by the PostgreSQL service

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Check that there are no trailing slashes in URLs
- Ensure you've redeployed both Railway and Vercel after making changes

### Database Connection Issues
- Ensure PostgreSQL service is running in Railway
- Check that `DATABASE_URL` is automatically set
- Run `prisma generate` is included in the build process (it's in package.json postinstall)

### 502 Bad Gateway
- Service might still be starting up (wait 30-60 seconds)
- Check Railway logs for application errors
- Verify the PORT environment variable matches what the app is using

### File Uploads Not Working
- Railway has ephemeral file storage - uploaded files will be lost on restart
- Consider using a cloud storage service (S3, Cloudinary, etc.) for production

## Next Steps

- ✅ Backend deployed on Railway
- ✅ Frontend on Vercel updated to use Railway backend
- ✅ Test all functionality end-to-end
- 🔄 Consider setting up a custom domain for Railway (optional)
- 🔄 Set up monitoring and alerts in Railway dashboard
- 🔄 Configure database backups in Railway PostgreSQL settings
