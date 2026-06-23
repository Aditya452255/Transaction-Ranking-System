# Deployment Guide

## Backend Deployment on Render

### Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (or other hosted MongoDB)

### Steps to Deploy:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a Render account**
   - Go to https://render.com and sign up
   - Connect your GitHub account

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the repository containing your backend code

4. **Configure the service**
   - **Name**: Choose a name (e.g., mern-workout-backend)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables**
   Go to "Environment" tab and add:
   - `MONGO_URI`: Your MongoDB connection string (from MongoDB Atlas)
   - `SECRET`: Your JWT secret (create a strong random string)
   - `FRONTEND_URL`: Your Vercel frontend URL (add this after deploying frontend)
   - `NODE_ENV`: production

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., https://your-app.onrender.com)

---

## Frontend Deployment on Vercel

### Prerequisites
- Vercel account
- Backend deployed on Render

### Steps to Deploy:

1. **Update environment variables**
   - Edit `frontend/.env.production`
   - Replace `https://your-backend-url.onrender.com` with your actual Render backend URL

2. **Install Vercel CLI (optional)**
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Vercel Dashboard (Recommended)**
   - Go to https://vercel.com and sign up/login
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   
4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = Your Render backend URL (e.g., https://your-app.onrender.com)
   - Make sure to add it for Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at https://your-project.vercel.app

6. **Update Backend CORS**
   - Go back to Render
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Your backend will automatically redeploy

---

## Alternative: Deploy via CLI

### Vercel CLI Deployment
```bash
cd frontend
vercel
# Follow the prompts
# When asked about settings, accept the defaults
```

---

## Post-Deployment

### Test your application:
1. Visit your Vercel URL
2. Try signing up a new user
3. Try logging in
4. Create, view, and delete workouts

### Troubleshooting:
- **CORS errors**: Make sure `FRONTEND_URL` in Render matches your Vercel URL
- **API not connecting**: Check `REACT_APP_API_URL` in Vercel environment variables
- **MongoDB errors**: Verify your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- **Check logs**: 
  - Render: Dashboard → Your service → Logs
  - Vercel: Dashboard → Your project → Deployments → View logs

---

## Important Notes:

1. **Free tier limitations**:
   - Render free tier: May spin down after inactivity (15 min to wake up)
   - Vercel free tier: Generous limits for personal projects

2. **MongoDB Atlas Setup**:
   - Create a cluster at https://cloud.mongodb.com
   - Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
   - Go to Database Access → Create a database user
   - Get connection string from Connect → Connect your application

3. **Environment Variables**:
   - Never commit `.env` files to git
   - Use `.env.example` files as templates
   - Set all environment variables in hosting platforms

4. **Continuous Deployment**:
   - Both Render and Vercel support automatic deployments
   - Any push to main branch will trigger a new deployment
