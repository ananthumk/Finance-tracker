# Finance Tracker

A comprehensive full-stack personal finance management application built with **Next.js 16**, **MongoDB**, and **React**. Track your income, expenses, manage budgets, and visualize your financial data with beautiful charts and graphs.

---

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Income & Expense Tracking** - Add, update, and delete transactions with categories
- **Monthly Reports** - View detailed income and expense summaries by month
- **Budget Management** - Set spending limits and track against budget
- **Data Visualization** - Interactive charts and graphs using Chart.js and Recharts
- **Category-wise Analytics** - Analyze spending patterns by category
- **Protected Routes** - User-specific data with role-based access control
- **Responsive Design** - Work seamlessly on desktop and mobile devices

---

## Tech Stack

**Frontend:**
- Next.js 16 with TypeScript
- React 19
- Tailwind CSS 4
- Chart.js & Recharts (Data visualization)
- React Icons & Lucide React (UI icons)
- SWR (Data fetching & caching)
- Axios (HTTP client)

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt (Password hashing)

**Tools:**
- Node.js
- ESLint (Code quality)
- PostCSS

---

## Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB instance running (local or cloud)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
cd finance-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment variables**
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://your_mongodb_connection_string (local or atlas)
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Project Structure

```
finance-app/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── budget/            # Budget management
│   │   │   ├── icome/             # Income transactions
│   │   │   ├── transition/        # Transaction endpoints
│   │   │   └── month/             # Monthly reports
│   │   ├── components/            # React components
│   │   ├── dashBoard/             # Dashboard page
│   │   ├── login/                 # Login page
│   │   ├── profile/               # User profile
│   │   ├── context/               # React context (UserContext)
│   │   └── globals.css
│   ├── lib/                       # Utility functions
│   │   ├── auth.ts               # JWT token management
│   │   └── mongoose.ts           # MongoDB connection
│   └── models/                    # Database models
│       ├── User.ts
│       ├── Budget.ts
│       └── Transaction.ts
├── package.json
└── tsconfig.json
```

---

## API Documentation

All API endpoints require authentication via JWT token in the `Authorization` header.

### **Base URL**
```
http://localhost:3000/api
```

### **Authentication Header**
```
Authorization: Bearer <your_jwt_token>
# or
Authorization: <your_jwt_token>
```

---

### **1. Authentication Endpoints**

#### Register New User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "Arun Kumar",
  "email": "arunkumar@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Arun Kumar",
    "email": "arunkumar@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "All input details are required!"
}
```

---

#### Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "arunkumar@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Arun Kumar",
    "email": "arunkumar@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid User"
}
```

---

#### Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Arun Kumar",
    "email": "arunkumar@example.com"
  }
}
```

---

### **2. Transaction Endpoints**

#### Add Transaction (Income or Expense)
**Endpoint:** `POST /icome/add`

**Request Body:**
```json
{
  "type": "expense",
  "amount": 5099,
  "category": "Groceries",
  "note": "Weekly grocery shopping",
  "date": "2026-04-08T10:30:00Z"
}
```

**Success Response (201):**
```json
{
  "message": "Transaction of expense added",
  "transaction": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "type": "expense",
    "amount": 5099,
    "category": "Groceries",
    "note": "Weekly grocery shopping",
    "date": "2026-04-08T10:30:00.000Z",
    "createdAt": "2026-04-08T15:45:22.123Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Missing required fields"
}
```

---

#### Get Expenses for a Month
**Endpoint:** `GET /transition/expense?month=4&year=2026`

**Query Parameters:**
- `month` (optional): Month number (1-12), defaults to current month
- `year` (optional): Year, defaults to current year

**Success Response (200):**
```json
{
  "expenses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "type": "expense",
      "amount": 5099,
      "category": "Groceries",
      "note": "Weekly grocery shopping",
      "date": "2026-04-08T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "type": "expense",
      "amount": 12050,
      "category": "Utilities",
      "note": "Monthly electricity bill",
      "date": "2026-04-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get All Transactions
**Endpoint:** `GET /icome/all?month=4&year=2026`

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year

**Success Response (200):**
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "type": "expense",
      "amount": 5099,
      "category": "Groceries",
      "date": "2026-04-08T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "type": "income",
      "amount": 300000,
      "category": "Salary",
      "date": "2026-04-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Update Transaction
**Endpoint:** `PUT /icome/[id]`

**Request Body:**
```json
{
  "type": "expense",
  "amount": 7550,
  "category": "Groceries",
  "note": "Updated grocery shopping",
  "date": "2026-04-08T10:30:00Z"
}
```

**Success Response (200):**
```json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439012",
    "amount": 7550,
    "category": "Groceries"
  }
}
```

---

### **3. Budget Endpoints**

#### Get Budget Summary
**Endpoint:** `GET /budget/summary?month=4&year=2026`

**Query Parameters:**
- `month` (optional): Month number (1-12), defaults to current month
- `year` (optional): Year, defaults to current year

**Success Response (200):**
```json
{
  "month": "2026-04",
  "income": "₹350000",
  "totalExpenses": "₹85075",
  "budget": "₹100000",
  "remaining": "₹14925",
  "percentageUsed": 85.08,
  "categories": {
    "Groceries": "₹15099",
    "Utilities": "₹12050",
    "Transportation": "₹20000",
    "Entertainment": "₹17926"
  }
}
```

---

#### Set Budget Limit
**Endpoint:** `POST /budget/limit`

**Request Body:**
```json
{
  "limit": 150000,
  "month": "2026-04"
}
```

**Success Response (201):**
```json
{
  "message": "Budget limit set successfully",
  "budget": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "limit": 150000,
    "month": "2026-04"
  }
}
```

---

### **4. Monthly Reports Endpoint**

#### Get Monthly Report
**Endpoint:** `GET /month?month=4&year=2026`

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year

**Success Response (200):**
```json
{
  "month": "April 2026",
  "totalIncome": "₹350000",
  "totalExpenses": "₹85075",
  "netSavings": "₹264925",
  "transactionCount": 15,
  "topExpenseCategory": "Transportation"
}
```

---

## Key Components

- **Navbar** - Navigation header with user menu
- **AddTransaction** - Form to add new income/expense
- **UpdateTransaction** - Edit existing transactions
- **Transaction** - Display individual transaction details
- **CategoryGraph** - Pie/bar charts for category breakdown
- **Graph** - Line/area charts for income vs expenses
- **Summary** - Financial summary dashboard
- **ProtectedRoute** - Component wrapper for authentication
- **Loader** - Loading spinner component

---

##  Getting Started

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## Usage Example

### Complete Workflow

1. **Register a new account**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mahesh Babu",
    "email": "maheshbabu@example.com",
    "password": "Password123"
  }'
```

2. **Login to get token**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maheshbabu@example.com",
    "password": "Password123"
  }'
```

3. **Add an expense transaction**
```bash
curl -X POST http://localhost:3000/api/icome/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "expense",
    "amount": 4599,
    "category": "Dining",
    "note": "Lunch with friends",
    "date": "2026-04-08T12:00:00Z"
  }'
```

4. **Get budget summary**
```bash
curl -X GET "http://localhost:3000/api/budget/summary?month=4&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes requiring authentication
- CORS and middleware protection
- Input validation and sanitization
- Secure token storage

---

## Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

Built with Tailwind CSS for mobile-first responsive design.

---

