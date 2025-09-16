# OAuth Setup Instructions

## Current Status
- Your app is running on: **http://localhost:3001**
- You need to create OAuth applications with the correct callback URLs

## Google OAuth Setup

### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - **IMPORTANT**: Add this exact redirect URI: `http://localhost:3001/api/auth/callback/google`
   - Click "Create"
5. Copy the Client ID and Client Secret

### Step 2: Update .env.local
Replace these lines in your `.env.local` file:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

With your actual credentials:
```
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
```

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `ERP System`
   - **Homepage URL**: `http://localhost:3001`
   - **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and Client Secret

### Step 2: Update .env.local
Replace these lines in your `.env.local` file:
```
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

With your actual credentials:
```
GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret
```

## After Updating Credentials
1. Restart your development server: `npm run dev`
2. Go to http://localhost:3001
3. Click "Continue with Google" or "Continue with GitHub"
4. OAuth should work perfectly!

## Current .env.local Status
Your file currently has placeholder values that need to be replaced with real OAuth credentials.

