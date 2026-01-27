# Fixing the Transformation Stories Display Issue

We have identified the root cause of the issue where transformation stories were not displaying even after approval.

## The Problem

1. The frontend (Vercel) was trying to fetch stories from `/api/transformations`.
2. Because the `VITE_API_URL` environment variable was likely missing or empty in production, the browser made a request to the same domain (relative path).
3. Vercel's configuration had a "catch-all" rewrite rule that sent ALL traffic (including `/api/...`) to `index.html` (the React app).
4. The fetch request received the HTML of the main page instead of the JSON data from the API.
5. This caused a hidden error in the background ("Invalid token < in JSON..."), resulting in an empty list of stories.

## The Fixes Applied

1. **Updated `client/pages/About.tsx`**: Added robust error detection. Now, if the API returns HTML (due to a misconfiguration) or fails with an error status, it will log a clear message to the console instead of failing silently.
2. **Updated `vercel.json`**: Modified the rewrite rule to **exclude** `/api/` paths.
   - OLD: rewriting everything `/(.*)` to `index.html`.
   - NEW: rewriting `everything EXCEPT /api/...` to `index.html`.
   - This prevents the confusing "HTML returned as JSON" error. If the API is missing, it will now correctly return a 404 code, making debugging much easier.

## Action Required: Configure Backend Connection

**You MUST perform the following step for the fix to work in production:**

1. Go to your **Vercel Dashboard** for this project.
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Railway Backend URL (e.g., `https://web-production-xxxx.up.railway.app`)
     *(Do not add a trailing slash)*
4. **Redeploy** the frontend (or trigger a new build) for the changes to take effect.

Once this is set, the frontend will correctly request data from your external backend, and the approved stories will display.
