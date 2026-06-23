# Fix Frontend API Connection

## The Problem
- Backend is working ✅ https://workout-buddy-qtjq.onrender.com/
- Frontend can't reach backend ❌
- Reason: `REACT_APP_API_URL` environment variable not set in Vercel

## Solution: Add Environment Variable to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project `workout-buddy-ten`
3. Go to **Settings** tab

### Step 2: Add Environment Variable
1. Click **Environment Variables** in left sidebar
2. Click **Add new**
3. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://workout-buddy-qtjq.onrender.com`
   - **Environments**: Check all boxes (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) → **Redeploy**
4. Confirm redeploy

### Step 4: Test
Wait 2-3 minutes, then:
1. Go to https://workout-buddy-ten.vercel.app
2. Try signing up
3. Check browser console (F12) for any errors

## Why `.env.production` doesn't work in Vercel
- Vercel doesn't read `.env.production` files from the repo
- You MUST set environment variables in Vercel Dashboard
- This is actually more secure - secrets aren't in your git repo

## If Still Not Working
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Open DevTools (F12) → Network tab
4. Try signing up and watch the API call
5. Check if request goes to: `https://workout-buddy-qtjq.onrender.com/api/user/signup`
