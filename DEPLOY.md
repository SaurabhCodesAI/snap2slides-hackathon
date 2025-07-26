# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Fork or Clone** this repository to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your forked repository

3. **Configure Environment Variables**:
   Copy the variables from `.env.example` and set them in Vercel:
   
   **Required:**
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   
   **Optional (for full functionality):**
   - `AUTH0_*` variables - For user authentication
   - `MONGODB_URI` - For saving presentation history
   - `NEXTAUTH_*` variables - For session management

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

## Environment Variables Setup

### Gemini AI (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Set `GEMINI_API_KEY` in Vercel

### Auth0 (Optional)
1. Create account at [Auth0](https://auth0.com)
2. Create a new application
3. Set the callback URLs to your Vercel domain
4. Copy the credentials to Vercel environment variables

The app will work with just the Gemini API key for basic functionality.
