# Firebase Setup Guide for Google OAuth

This guide will walk you through setting up Firebase for Google OAuth authentication.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "Eraya Wellness Travels")
4. Accept the terms and click **Continue**
5. Disable Google Analytics (optional) or configure it
6. Click **Create project**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon** (`</>`) to add a web app
2. Enter an **App nickname** (e.g., "Eraya Web App")
3. **DO NOT** check "Set up Firebase Hosting"
4. Click **Register app**
5. You'll see your Firebase config - **keep this page open**

## Step 3: Get Firebase Client Configuration

Copy the config object values and add them to your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## Step 4: Enable Google Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **Get started** (if first time)
3. Click the **Sign-in method** tab
4. Find **Google** in the list of providers
5. Click **Google** to expand
6. Toggle **Enable** to ON
7. Set **Project support email** (your email)
8. Click **Save**

## Step 5: Add Authorized Domains

1. Still in **Authentication** > **Sign-in method** tab
2. Scroll down to **Authorized domains**
3. `localhost` should already be there
4. Click **Add domain** and add your production domain (when ready)
   - Example: `erayawellness.com`

## Step 6: Get Firebase Admin SDK Credentials

For backend token verification:

1. In Firebase Console, click the **gear icon** ⚙️ > **Project settings**
2. Click the **Service accounts** tab
3. Click **Generate new private key**
4. Click **Generate key** - this downloads a JSON file
5. **IMPORTANT**: Keep this file secure, never commit it to Git

### Convert JSON to Single Line

Open the downloaded JSON file and minify it to a single line:

**Option A: Use an online minifier**
1. Go to https://www.cleancss.com/json-minify/
2. Paste your JSON
3. Click "Minify"
4. Copy the result

**Option B: Use command line (Mac/Linux)**
```bash
cat path/to/your-firebase-service-account.json | jq -c
```

**Then add to `.env`:**
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"123456789012345678901","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

## Step 7: Restart Your Development Server

After adding all environment variables:

```bash
# Stop the running dev server (Ctrl+C)
# Then restart:
pnpm dev
```

## Step 8: Test Authentication

1. Open your application in the browser
2. Click **Login** or **Sign up**
3. Click **Continue with Google**
4. Select a Google account
5. Verify successful login

## Troubleshooting

### "popup-blocked" Error
- Allow popups in your browser for `localhost`
- Chrome: Click the popup icon in address bar
- Safari: Preferences > Websites > Pop-up Windows

### "auth/operation-not-allowed" Error
- Google provider is not enabled in Firebase Console
- Go back to Step 4 and enable it

### "Invalid authentication token" Error
- Firebase service account key is missing or incorrect
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env`
- Make sure it's properly minified to a single line

### "Email already registered" (OTP users migrating)
- This is expected behavior
- Google OAuth will link to the existing account
- User data will be merged automatically

## Production Deployment

Before deploying to production:

1. Add your production domain to **Authorized domains** in Firebase Console
2. Update CORS settings in your backend to allow production domain
3. Set environment variables on your hosting platform
4. **NEVER** commit `.env` file or service account JSON to Git

## Security Notes

- Firebase API keys are safe to expose in client code (they identify your project)
- The service account key is SECRET - never expose it publicly
- All tokens are verified server-side for security
- Google handles user authentication - you never see passwords
