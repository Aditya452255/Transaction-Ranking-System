# MERN Full Stack Workout Tracker

A full-stack workout tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Users can sign up, log in, and manage their workout routines.

**M**: MongoDB (DB)  
**E**: ExpressJS (Backend)  
**R**: ReactJS (Frontend)  
**N**: NodeJS (Backend)

## Features

- 🔐 User authentication (JWT)
- ✨ Create, read, and delete workouts
- 📱 Responsive design
- 🔒 Protected routes
- 🚀 Ready for deployment on Vercel (frontend) and Render (backend)

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Context API for state management
- date-fns for date formatting

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured for local development:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - Login user

### Workouts (Protected)
- `GET /api/workouts` - Get all workouts for logged-in user
- `POST /api/workouts` - Create a new workout
- `DELETE /api/workouts/:id` - Delete a workout

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel and Render.

### Quick Deployment Overview

**Backend (Render)**:
- Push code to GitHub
- Create a new Web Service on Render
- Set root directory to `backend`
- Add environment variables (MONGO_URI, SECRET, FRONTEND_URL)
- Deploy

**Frontend (Vercel)**:
- Connect GitHub repository to Vercel
- Set root directory to `frontend`
- Add `REACT_APP_API_URL` environment variable with your Render backend URL
- Deploy

## Project Structure

```
.
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── workoutController.js
│   ├── middleware/
│   │   └── requireAuth.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── workoutModel.js
│   ├── routes/
│   │   ├── user.js
│   │   └── workout.js
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── .env.production
│   ├── package.json
│   └── vercel.json
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
FRONTEND_URL=your_frontend_url
```

### Frontend (.env)
```
REACT_APP_API_URL=your_backend_url
```

## Development Notes

- Backend uses nodemon for auto-restart during development
- Frontend uses React Scripts for hot reloading
- CORS is configured to accept requests from the frontend URL
- All workout routes are protected with JWT authentication
- Passwords are hashed using bcrypt before storing in database

## License

This project is open source and available under the MIT License.