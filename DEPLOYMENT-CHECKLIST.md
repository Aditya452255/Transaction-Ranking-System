# Deployment Checklist

## Before Deployment

### Backend
- [x] CORS installed and configured
- [x] Environment variables configured
- [x] `.env.example` file created
- [x] `render.yaml` file created
- [x] Server listens on process.env.PORT
- [ ] Code pushed to GitHub

### Frontend
- [x] API calls use `process.env.REACT_APP_API_URL`
- [x] `.env` file created for development
- [x] `.env.production` file created
- [x] `vercel.json` file created
- [x] Proxy removed from package.json
- [ ] Code pushed to GitHub

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (allow all: 0.0.0.0/0)
- [ ] Connection string obtained

---

## Deployment Steps

### Step 1: Deploy Backend on Render
1. [ ] Create Render account and connect GitHub
2. [ ] Create new Web Service
3. [ ] Select repository and set root directory to `backend`
4. [ ] Configure build command: `npm install`
5. [ ] Configure start command: `npm start`
6. [ ] Add environment variables:
   - [ ] `MONGO_URI` (from MongoDB Atlas)
   - [ ] `SECRET` (create strong random string)
   - [ ] `NODE_ENV` = production
   - [ ] `FRONTEND_URL` (will add after Vercel deployment)
7. [ ] Deploy and note the backend URL
8. [ ] Test backend: Visit `https://your-backend.onrender.com`

### Step 2: Deploy Frontend on Vercel
1. [ ] Create Vercel account and connect GitHub
2. [ ] Import project
3. [ ] Set root directory to `frontend`
4. [ ] Set framework preset to Create React App
5. [ ] Add environment variable:
   - [ ] `REACT_APP_API_URL` = your Render backend URL
6. [ ] Deploy and note the frontend URL
7. [ ] Test frontend: Visit your Vercel URL

### Step 3: Update Backend CORS
1. [ ] Go back to Render dashboard
2. [ ] Update `FRONTEND_URL` environment variable with your Vercel URL
3. [ ] Backend will automatically redeploy

---

## Post-Deployment Testing

### Test Authentication
- [ ] Sign up a new user
- [ ] Log in with created user
- [ ] Log out

### Test Workout Operations
- [ ] Create a new workout
- [ ] View all workouts
- [ ] Delete a workout

### Check for Issues
- [ ] No CORS errors in browser console
- [ ] API requests successful
- [ ] All routes work correctly
- [ ] Protected routes redirect to login when not authenticated

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Make sure CORS is installed: `npm list cors` in backend directory
- Check backend logs on Render dashboard

### API Connection Errors
- Verify `REACT_APP_API_URL` in Vercel matches your Render URL exactly
- Check that backend is running on Render
- Look at Vercel deployment logs

### MongoDB Connection Errors
- Check MongoDB Atlas network access settings
- Verify connection string in Render environment variables
- Check MongoDB Atlas logs

### Backend Not Starting
- Check Render logs for errors
- Verify all environment variables are set
- Make sure `package.json` has correct start script

---

## Important URLs to Save

- **Backend URL**: https://_____.onrender.com
- **Frontend URL**: https://_____.vercel.app
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Free Tier Limitations

### Render
- Spins down after 15 minutes of inactivity
- First request after spin-down may take 30-50 seconds
- 750 hours/month free

### Vercel
- 100 GB bandwidth/month
- Unlimited projects
- Automatic SSL

### MongoDB Atlas
- 512 MB storage
- Shared cluster
- Limited to one cluster
