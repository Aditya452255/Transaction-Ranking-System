# Transaction Ranking System (MERN Stack)

A secure, full-stack transaction tracking and ranking application built with the MERN stack (MongoDB, Express, React, Node.js). This system allows users to securely authenticate, manage their transactions, view analytics summaries, and compete on a global multi-factor leaderboard.

---

## 1. Project Overview

The Transaction Ranking System is designed to log transactions, compute analytics summaries, and calculate a live global leaderboard where users are ranked based on their activity, volume, and consistency. To protect integrity, the system implements robust duplicate prevention, schema validations, and abuse-prevention rate limits to mitigate ranking manipulation.

---

## 2. Features

- **Secure JWT Authentication**: Users can register and sign in securely. All transaction operations and analytical reports require authentication via JSON Web Tokens (JWT).
- **Transaction Management**: Standard CRUD operations for logging, retrieving, and deleting transactions.
- **User Summary Analytics**: Live on-demand statistics summarizing total transactions, aggregate value, average value, highest transaction, and lowest transaction.
- **Global Leaderboard**: A real-time leaderboard highlighting the active rankings of all users based on a multi-factor score.
- **Duplicate Prevention**: Multi-layered check to prevent duplicate transaction entries.
- **Abuse Prevention**: Validations and rate-limiters preventing users from uploading massive values or spamming endpoints to manipulate leaderboard standings.

---

## 3. API Documentation

All request endpoints (except user login/signup) require a valid JWT token sent in the `Authorization` header: `Bearer <token>`.

### Authentication Endpoints

#### `POST /api/user/signup`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "email": "user@example.com",
    "token": "eyJhbGciOi...",
    "_id": "60c72b2f9b1d8a0015d3a5a4"
  }
  ```

#### `POST /api/user/login`
- **Description**: Authenticates an existing user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "email": "user@example.com",
    "token": "eyJhbGciOi...",
    "_id": "60c72b2f9b1d8a0015d3a5a4"
  }
  ```

---

### Transaction Endpoints

#### `POST /api/transactions`
- **Description**: Creates a new transaction for the authenticated user.
- **Request Body**:
  ```json
  {
    "transactionId": "TXN-9817234",
    "amount": 250
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "60c72b5c9b1d8a0015d3a5a8",
    "transactionId": "TXN-9817234",
    "amount": 250,
    "user_id": "60c72b2f9b1d8a0015d3a5a4",
    "createdAt": "2026-06-23T10:44:31.250Z",
    "updatedAt": "2026-06-23T10:44:31.250Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Please fill in all fields", "emptyFields": ["amount"] }`
  - `400 Bad Request`: `{ "error": "Transaction amount exceeds allowed limit" }` (Amount > 100,000)
  - `409 Conflict`: `{ "error": "Duplicate transaction" }` (Transaction ID already exists)
  - `429 Too Many Requests`: `{ "error": "Daily transaction limit exceeded" }` (Limit of 20 per day reached)

#### `GET /api/transactions`
- **Description**: Fetches all transactions for the authenticated user, sorted by amount in descending order.
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "60c72b5c...",
      "transactionId": "TXN-9817234",
      "amount": 250,
      "createdAt": "..."
    }
  ]
  ```

#### `DELETE /api/transactions/:id`
- **Description**: Deletes a specific transaction by its MongoDB ObjectId.
- **Response (200 OK)**: Returns the deleted transaction object.

---

### Analytics & Rankings Endpoints

#### `GET /api/summary/:userId`
- **Description**: Calculates aggregate statistics for the specified user.
- **Response (200 OK)**:
  ```json
  {
    "userId": "60c72b2f9b1d8a0015d3a5a4",
    "totalTransactions": 15,
    "totalAmount": 12000,
    "averageAmount": 800,
    "highestTransaction": 3000,
    "lowestTransaction": 100
  }
  ```

#### `GET /api/ranking`
- **Description**: Generates the global leaderboard, aggregating all transactions, computing scores, joining user emails, and returning results sorted descending by score.
- **Response (200 OK)**:
  ```json
  [
    {
      "rank": 1,
      "userId": "60c72b2f9b1d8a0015d3a5a4",
      "userEmail": "user@example.com",
      "score": 8550,
      "totalAmount": 12000,
      "transactionCount": 15
    }
  ]
  ```

---

## 4. Ranking Formula

To evaluate user standing, the leaderboard uses a weighted scoring algorithm calculated dynamically in a MongoDB aggregation pipeline:

$$\text{Score} = (\text{Total Amount} \times 0.7) + (\text{Transaction Count} \times 20) + \text{Consistency Bonus}$$

- **Total Amount (70% Weight)**: Rewards volume of transactions.
- **Transaction Count (flat 20 pts per entry)**: Rewards engagement and frequency.
- **Consistency Bonus**: Grants **50 points per unique calendar day** on which transactions occurred, but only if they span multiple days ($\text{Unique Days} > 1$). This rewards regular, sustained usage rather than single-day spams.

---

## 5. Duplicate Prevention

To preserve data integrity and prevent multiple records of the same event:
1. **Unique Indexes**: A unique database index is defined on `transactionId` in MongoDB.
2. **Pre-Insertion Lookup**: The controller queries `Transaction.findOne({ transactionId })` before executing `create()`.
3. **HTTP 409 Conflict Response**: If a duplicate transaction is attempted, the request is immediately rejected with a `409` status code and `{ "error": "Duplicate transaction" }` message, bypassing Mongoose creation.

---

## 6. Data Consistency

The system secures consistency through multiple checkpoints:
- **MongoDB Atomic Operations**: Creating, updating, or deleting single records is executed atomically. Aggregation queries retrieve the exact database state at the execution time.
- **Mongoose Schemas**: Type checks, limits (`min: 1` for amount), and constraints are enforced at the schema level.
- **Write Validation**: Requests passing empty strings or malformed numbers are filtered out by controller validation and Schema validators, preventing corrupt writes.

---

## 7. Abuse Prevention & Ranking Integrity

To mitigate Sybil attacks and artificial leaderboard manipulation, the system enforces the following limits:
- **Positive Amounts Only**: Schema enforces `min: 1` on transaction amount. Negative values or $0 transactions are rejected.
- **Maximum Transaction Limit (100,000)**: Rejects transactions with amounts > 100,000. This blocks attackers from logging fake massive values to bypass other scoring factors.
- **Daily Transaction Rate Limit (20/day)**: Prevents scripts from repeatedly adding tiny $1 transactions in a short time frame to artificially boost the count-based score. The server counts the user's transactions since `00:00:00 UTC` of the current day and returns a `429 Too Many Requests` code once the limit is hit.

---

## 8. Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance or MongoDB Atlas account

### 1. Clone & Install Dependencies

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory (see [Environment Variables](#9-environment-variables)).

### 3. Run Locally

```bash
# Run backend server (from backend folder)
npm run dev

# Run frontend React app (from frontend folder)
npm start
```

Open `http://localhost:3000` to view the application.

---

## 9. Environment Variables

Create a `backend/.env` file with:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

---

## 10. Deployment Instructions

### Backend (e.g. Render)
1. Push the code repository to GitHub.
2. Link your repository to a new **Web Service** on Render.
3. Configure the environment:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Set Environment Variables:
   - `MONGO_URI`, `JWT_SECRET`, `PORT` (5000), `FRONTEND_URL` (your frontend deployment URL).

### Frontend (e.g. Vercel)
1. Create a new project in Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Create React App`
4. Configure Environment Variables:
   - `REACT_APP_API_URL` (your deployed backend service URL).
5. Deploy.