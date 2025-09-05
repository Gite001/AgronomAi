
# AgronomAi

This is a Next.js project for AgronomAi, an intelligent assistant for agriculture professionals.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables (CRITICAL)

This project requires environment variables to connect to Firebase and Google AI services. The way you set them depends on whether you are running the app locally or deploying it.

### 1. For Local Development

For the application to work on your local machine, you **must** create a file named `.env.local` in the root of your project. You can do this by copying the example file:

```bash
cp .env.example .env.local
```

Then, open `.env.local` and paste your actual keys, replacing the placeholder values.

```
# Firebase Keys (Get these from your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"

# Google AI (Gemini) API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: Google Maps API Key for the Map view
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

# Optional: Analytics & Monetization
NEXT_PUBLIC_GA_ID="YOUR_GOOGLE_ANALYTICS_ID"
NEXT_PUBLIC_ADSENSE_CLIENT_ID="YOUR_ADSENSE_CLIENT_ID"
```
**Important:** The `.env.local` file is for your local machine only and should not be shared or committed to version control.

### 2. For Production Deployment (Netlify, Vercel, etc.)

When you deploy your application, you **must** set these same environment variables in your hosting provider's dashboard. This is the secure and correct way to handle secret keys in production. An error like `auth/configuration-not-found` means your hosting provider's environment variables are not set correctly.

## Firebase Configuration Guide

For the login/signup functionality to work, you **must** configure your own Firebase project and add the keys to your environment variables as described above. An error like `auth/configuration-not-found` or `auth/invalid-api-key` means your Firebase project is not set up correctly.

### Step 1: Create a Firebase Web App & Get Config Keys

1.  In the [Firebase Console](https://console.firebase.google.com/), go to **Project Settings** (gear icon).
2.  In the **General** tab, scroll down to **"Your apps"**.
3.  Click the **Web icon (`</>`)** to add a new web application.
4.  Give it a nickname (e.g., "AgronomAi") and click **"Register app"**.
5.  Firebase will display your `firebaseConfig` object. You will use these keys for your environment variables.
    ![Create Firebase Web App](https://storage.googleapis.com/fbs-public/devrel/studio-guides/agronom-ai/firebase-create-web-app.png)

### Step 2: Enable Sign-in Providers

1.  In the Firebase Console, go to **Authentication** > **Sign-in method** tab.
2.  Enable the **Email/Password** provider.
3.  Enable the **Google** provider if you want to allow Google Sign-In.
    ![Enable Sign-in Providers](https://storage.googleapis.com/fbs-public/devrel/studio-guides/agronom-ai/firebase-signin-providers.png)

### Step 3: Authorize Your Application's Domain

This is the most critical step to fix `auth/configuration-not-found`.

1.  In the Firebase Console, go to **Authentication** > **Settings** tab.
2.  Select the **Authorized domains** sub-tab.
3.  Click **"Add domain"**.
4.  Add the domain where your app is hosted (e.g., `solutions.netlify.app` if you are using a preview environment) and **`localhost`** for local testing.
    ![Authorize Domains](https://storage.googleapis.com/fbs-public/devrel/studio-guides/agronomai/firebase-authorized-domains.png)

After completing these steps, the authentication system should work correctly.
