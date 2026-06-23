# Backend Deployment Troubleshooting

## Error: 404 - Backend Not Responding

### Check 1: Is Your Backend Running on Render?
1. Go to https://dashboard.render.com
2. Click on your backend service (`workout-buddy-qtjq`)
3. Check the **Status** - should show "Live" (green)
4. If it shows "Failed" or "Building", click "Deploy latest commit"

### Check 2: Test Backend Directly
Try accessing your backend root URL in a browser:
- Open: `https://workout-buddy-qtjq.onrender.com/`
- You should see: `{"msg":"Hello from Express server!"}`
- If you see HTML error page or blank page = backend not running

### Check 3: Check Render Logs
1. In your Render dashboard, go to your backend service
2. Click the **Logs** tab
3. Look for errors like:
   - `MongoError` - Database connection issue
   - `Cannot find module` - Missing dependency
   - `EADDRINUSE` - Port conflict
   - `JWT_SECRET undefined` - Missing environment variable

### Check 4: Verify Environment Variables on Render
Go to your backend service → **Environment** tab:
- ✅ `MONGO_URI` - Should be your MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Should be set (aditya@9811)
- ✅ `FRONTEND_URL` - Should be https://workout-buddy-ten.vercel.app
- ✅ `NODE_ENV` - Should be production

### Check 5: Verify MongoDB Connection
1. Check if MongoDB Atlas cluster is running
2. Go to https://cloud.mongodb.com
3. Click your cluster
4. Check **Network Access** - should allow 0.0.0.0/0
5. Check **Database Users** - verify the user exists
6. Copy the connection string and verify in Render env var

### Check 6: Redeploy Backend
1. Go to your Render backend service dashboard
2. Scroll down and click **"Deploy latest commit"**
3. Wait 2-3 minutes for deployment
4. Check logs for errors

### Quick Fixes
If backend is stuck:
1. Click the menu (⋯) → Delete Service
2. Reconnect your GitHub repo and redeploy
3. Or push a new commit to trigger auto-deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin master
   ```

### Common Issues & Solutions

**Issue**: "Cannot find module 'mongoose'"
- Solution: Render didn't install dependencies. Check if package.json is in `/backend`

**Issue**: "MongoError: getaddrinfo ENOTFOUND"
- Solution: MongoDB connection string is wrong. Copy it again from MongoDB Atlas

**Issue**: Backend returns 404 for all routes
- Solution: Routes might be mounted after middleware. Check server.js order

**Issue**: CORS error persists
- Solution: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly

### Still Not Working?
Contact Render Support or check these resources:
- https://render.com/docs
- https://docs.mongodb.com
- Backend logs: https://dashboard.render.com → your service → Logs
