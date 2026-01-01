# 🔧 Solution 1: Add NODE_OPTIONS as Railway Environment Variable

## Step-by-Step Instructions

### 1. Go to Railway Dashboard

1. Open https://railway.app
2. Sign in if not already
3. Click on your project
4. Click on your **main service** (not the database)

### 2. Add NODE_OPTIONS Variable

1. Click on the **"Variables"** tab (in the top navigation)
2. Click **"New Variable"** button
3. In the form that appears:
   - **Variable**: `NODE_OPTIONS`
   - **Value**: `--max-old-space-size=8192`
4. Click **"Add"** or press Enter

### 3. Verify Variable is Added

You should see in your variables list:
```
NODE_OPTIONS = --max-old-space-size=8192
```

### 4. Trigger Rebuild

Railway should automatically detect the new variable and trigger a rebuild.

If it doesn't:
1. Go to **"Deployments"** tab
2. Click the **"⋮"** menu on the latest deployment
3. Click **"Redeploy"**

### 5. Monitor the Build

1. Watch the build logs in real-time
2. Look for these signs of success:
   ```
   ✓ Building...
   ✓ pnpm install
   ✓ pnpm run build
   ✓ vite build (client)
   ✓ vite build (server)
   ✓ Deployment successful
   ```

### 6. If Build Succeeds ✅

Continue with deployment:
1. Verify the app is running
2. Check the deployment URL
3. Follow DEPLOYMENT_GUIDE.md for domain setup

### 7. If Build Still Fails ❌

Two options:

**Option A: Upgrade Railway Plan**
- Go to Settings → Plans
- Upgrade to Hobby ($5/month)
- This gives you 8GB RAM for builds
- Guaranteed to work

**Option B: Split Deployment (Vercel + Railway)**
- Deploy frontend on Vercel (free, optimized for React)
- Deploy backend on Railway (database + API)
- More reliable for production

---

## Quick Reference

### Environment Variable to Add

```
Variable: NODE_OPTIONS
Value: --max-old-space-size=8192
```

### What This Does

- Gives Node.js 8GB of memory during build
- Prevents out-of-memory errors during Vite build
- Only applies during build, not runtime
- More reliable than setting in build command

---

## Next Steps After Successful Build

Once the build succeeds:

1. ✅ Verify deployment is live
2. 📝 Follow DEPLOYMENT_GUIDE.md
3. 🌐 Configure domain (erayawellness.com)
4. ⚙️ Add remaining environment variables
5. 🔒 Disable payments in admin settings
6. 🎉 Website is live!

---

Good luck! The build should succeed this time. 🚀
