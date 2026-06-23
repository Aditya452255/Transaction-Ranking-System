// Importing the Express package
const express = require('express');
// Importing CORS package
const cors = require('cors');
// Importing dotenv to manage environment variables
const dotenv =  require('dotenv');
// Importing mongoose to connect to MongoDB
const mongoose = require('mongoose');
// Importing transaction routes
const transactionRoutes = require('./routes/transaction')
const userRoutes = require('./routes/user')
// Configuring dotenv
dotenv.config();
// Express app initialization
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from the frontend URL with or without trailing slash
    const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    
    // Allow localhost, production URL, and all Vercel preview deployments
    if (!origin || 
        origin === 'http://localhost:3000' ||
        origin.replace(/\/$/, '') === allowedOrigin ||
        origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
// Logger middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({msg: 'Hello from Express server!'});
});
// Transaction routes
app.use('/api/transactions', transactionRoutes);
// User routes
app.use('/api/user', userRoutes);
// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api', analyticsRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
// Port number
const PORT = process.env.PORT || 5000;
//  listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 