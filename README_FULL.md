# YouTube Clone - Full Stack Application

my github link --> https://github.com/pranjal-rajput31/youtube-clone-1/


A full-stack YouTube clone built with **React 19**, **Vite**, **Express.js**, **MongoDB**, and **Redux Toolkit**. Features include video management, user authentication, commenting system, likes/dislikes, and lazy loading for optimal performance.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
- [Code Organization](#code-organization)
- [Performance Optimizations](#performance-optimizations)
- [Troubleshooting](#troubleshooting)

---

## 📱 Project Overview

This YouTube Clone project demonstrates a complete MERN stack implementation with:
- Modern React with code splitting and lazy loading
- RESTful API with Express.js and MongoDB
- JWT-based authentication
- Real-time interactions (likes, comments, subscriptions)
- Responsive UI with CSS styling
- Database seeding for easy evaluation

**Purpose**: Educational demonstration of full-stack web development with industry best practices.

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI framework with hooks and lazy loading
- **Vite 7.2** - Fast build tool with HMR
- **Redux Toolkit 2.11** - State management
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2** - Web framework
- **MongoDB 9.0** - NoSQL database
- **Mongoose 9.0** - ODM for MongoDB
- **JWT** - Secure authentication tokens
- **Nodemon** - Development hot reload

### Development Tools
- **ESLint** - Code quality
- **Dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
YouTubeClone/
├── YouTube/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── VideoCard.jsx        # Video grid item
│   │   │   ├── CommentBox.jsx       # Comment input
│   │   │   ├── Comments.jsx         # Comments list (lazy loaded)
│   │   │   └── Recommendations.jsx  # Video recommendations (lazy loaded)
│   │   ├── pages/                   # Page components (lazy loaded)
│   │   │   ├── Home.jsx             # Home page
│   │   │   ├── VideoDetail.jsx      # Video detail page
│   │   │   ├── Search.jsx           # Search results
│   │   │   ├── Uploads.jsx          # User uploads
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Register.jsx         # Registration page
│   │   ├── styles/                  # CSS files
│   │   ├── utils/                   # Utility functions
│   │   │   ├── helpers.js           # Helper functions
│   │   │   ├── api.js               # API call utilities
│   │   │   └── store.js             # Redux store setup
│   │   ├── redux/                   # Redux slices
│   │   │   └── videoSlice.js        # Video state management
│   │   ├── App.jsx                  # Root component with routing
│   │   └── main.jsx                 # Entry point
│   ├── public/                       # Static assets
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── eslint.config.js             # ESLint rules
│
├── Backend/                          # Backend (Node.js + Express)
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── jwt.js                   # JWT utilities
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Video.js                 # Video schema
│   │   ├── Comment.js               # Comment schema
│   │   └── Channel.js               # Channel schema
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── videoController.js       # Video operations
│   │   ├── commentController.js     # Comment operations
│   │   ├── userController.js        # User profile operations
│   │   └── channelController.js     # Channel operations
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── videoRoutes.js           # Video endpoints
│   │   ├── commentRoutes.js         # Comment endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   └── channelRoutes.js         # Channel endpoints
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── errorHandler.js          # Error handling
│   ├── utils/
│   │   └── validators.js            # Input validation
│   ├── .env                         # Environment variables
│   ├── server.js                    # Main server file
│   ├── seed.js                      # Database seeding script
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
│
└── README.md                        # This file
```

---

## 🔧 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v9.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (v8 or higher) - Comes with Node.js
- A code editor (VS Code recommended)

### Verify Installation

```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show v8.0.0 or higher
mongod --version  # Should show MongoDB version
```

---

## 📦 Installation & Setup

### Step 1: Clone or Navigate to Project

```bash
cd YouTubeClone/YouTube
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd Backend
npm install
cd ..
```

---

## ⚙️ Environment Configuration

### Frontend Configuration (`.env` in `YouTube/` directory)

Create a `.env` file in the root YouTube directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Configuration (`.env` in `YouTube/Backend/` directory)

Create a `.env` file in the Backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/youtube-clone

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Client Configuration
CLIENT_URL=http://localhost:5173
```

**⚠️ Important**: Change `JWT_SECRET` to a strong random string for production.

---

## 🚀 Running the Application

### Option 1: Run Frontend and Backend Separately

#### Terminal 1 - Start MongoDB

```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

#### Terminal 2 - Start Backend Server

```bash
cd Backend
npm start
# Server will run on http://localhost:5000
```

#### Terminal 3 - Start Frontend Development Server

```bash
npm run dev
# Frontend will run on http://localhost:5173
```

### Option 2: Run with npm Scripts

**First-time setup:**
```bash
npm install
cd Backend && npm install && cd ..
```

**Start both servers:**
Open two terminals in the root `YouTube/` directory:

```bash
# Terminal 1
npm run dev

# Terminal 2
cd Backend && npm start
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🌱 Database Seeding

To populate the database with sample data for testing:

```bash
cd Backend
npm run seed
```

This will create:
- **3 sample users** with different profiles
- **3 sample channels** with descriptions
- **6 sample videos** with thumbnails and metadata
- **5 sample comments** with engagement data
- Realistic relationships (subscriptions, likes, etc.)

### Sample Login Credentials (After Seeding)

```
Email: john@example.com
Password: password123

Email: sarah@example.com
Password: password123

Email: mike@example.com
Password: password123
```

See `Backend/SEED_README.md` for detailed seeding documentation.

---

## 🏗️ Architecture

### Frontend Architecture

```
App.jsx (Root Component)
├── Header (Navigation)
├── Sidebar (Categories)
└── Routes (Page Components)
    ├── Home (Lazy Loaded)
    ├── VideoDetail (Lazy Loaded)
    │   ├── Comments (Lazy Loaded Component)
    │   └── Recommendations (Lazy Loaded Component)
    ├── Search (Lazy Loaded)
    ├── Uploads (Lazy Loaded)
    ├── Profile (Lazy Loaded)
    ├── Login (Lazy Loaded)
    └── Register (Lazy Loaded)

Redux Store
├── videoSlice (Video state management)
│   ├── videos
│   ├── selectedVideo
│   ├── searchResults
│   └── loading status
```

### Backend Architecture

```
Client Request
    ↓
Express Middleware (CORS, JSON parsing)
    ↓
Routes (URL pattern matching)
    ↓
Controllers (Business logic)
    ↓
Models (MongoDB schema & validation)
    ↓
Database (MongoDB)
```

### Data Flow

1. **User Registration/Login**
   - Credentials sent to backend
   - Password hashed with bcryptjs
   - JWT token generated
   - Token stored in frontend (localStorage/state)

2. **Video Operations**
   - Frontend sends request with JWT token
   - Backend verifies token (auth middleware)
   - Controller processes request
   - MongoDB stores/retrieves data
   - Response sent to frontend
   - Redux state updated

3. **Real-time Updates**
   - Like/dislike counts updated in DB
   - Frontend state synced with backend response
   - UI re-renders automatically via React

---

## ✨ Key Features

### 1. User Authentication
- **Register**: Create new user account
- **Login**: Authenticate with email/password
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Some pages require authentication

### 2. Video Management
- **Browse Videos**: View all videos on home page
- **Search Videos**: Search by title or channel
- **Video Details**: View video with metadata, duration, views
- **Upload Videos**: Create and upload new videos
- **Edit Videos**: Update video title and description
- **Delete Videos**: Remove videos (owner only)

### 3. Interactions
- **Likes/Dislikes**: Like or dislike videos with count updates
- **Comments**: Add, edit, delete comments on videos
- **Subscriptions**: Subscribe to channels and view subscriber count
- **User Profiles**: View user info and uploaded videos

### 4. Performance
- **Code Splitting**: Pages load on-demand with React.lazy()
- **Lazy Loading**: Comments and recommendations load when visible
- **Suspense**: Loading states while components are being fetched
- **Optimized Rendering**: Efficient re-renders with Redux

### 5. UI/UX
- **Responsive Design**: Works on desktop, tablet, mobile
- **Navigation**: Easy navigation between pages
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations

---

## 📡 API Documentation

See `Backend/README.md` for complete API endpoint documentation including:
- Request/response examples
- Authentication requirements
- Error handling
- Status codes

### Quick Reference

**Base URL**: `http://localhost:5000/api`

**Authentication**: Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/videos` | No | Get all videos |
| GET | `/videos/:id` | No | Get single video |
| POST | `/videos` | Yes | Create video |
| PUT | `/videos/:id/like` | Yes | Like video |
| PUT | `/videos/:id/dislike` | Yes | Dislike video |
| POST | `/comments` | Yes | Add comment |
| GET | `/users/:id` | No | Get user profile |

---

## 📋 Code Organization

### Frontend Code Structure

#### Components (`src/components/`)
Each component has:
- Clear export statement
- JSX structure for rendering
- Inline comments for complex logic
- Props destructuring for readability

**Example**:
```javascript
// VideoCard.jsx - Displays single video in grid
import React from 'react'
import { formatDuration } from '../utils/helpers'

export default function VideoCard({ video }) {
  // Format view count (1M, 1K, etc)
  const formatViews = (views) => { ... }
  
  // Calculate time since upload
  const getTimeAgo = (date) => { ... }
  
  return (
    <Link to={`/video/${video._id}`} className="video-card">
      {/* Video thumbnail and info */}
    </Link>
  )
}
```

#### Pages (`src/pages/`)
All pages are lazy loaded for performance:
```javascript
// In App.jsx
const Home = lazy(() => import('./pages/Home'))
const VideoDetail = lazy(() => import('./pages/VideoDetail'))
```

#### Utilities (`src/utils/`)
- `helpers.js` - Format functions (duration, dates, numbers)
- `api.js` - API call wrappers
- `store.js` - Redux store configuration

#### Redux (`src/redux/`)
- `videoSlice.js` - Video state management with reducers

### Backend Code Structure

#### Controllers (`Backend/controllers/`)
Each controller handles specific domain:
```javascript
// videoController.js
export const getVideos = async (req, res) => { ... }
export const getVideo = async (req, res) => { ... }
export const likeVideo = async (req, res) => { ... }
export const dislikeVideo = async (req, res) => { ... }
```

#### Models (`Backend/models/`)
Mongoose schemas with validation:
```javascript
// Video.js
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  duration: { type: Number, default: 0 },
  // ... more fields
})
```

#### Routes (`Backend/routes/`)
Clean route definitions with middleware:
```javascript
// videoRoutes.js
router.get('/', getVideos)
router.get('/:id', getVideo)
router.post('/', protect, createVideo)
router.put('/:id/like', protect, likeVideo)
```

#### Middleware (`Backend/middleware/`)
- `auth.js` - JWT verification and authentication
- `errorHandler.js` - Centralized error handling

---

## ⚡ Performance Optimizations

### Frontend Optimizations

1. **Code Splitting with React.lazy()**
   ```javascript
   // Pages load on-demand, not all at once
   const Home = lazy(() => import('./pages/Home'))
   ```

2. **Suspense Boundaries**
   ```javascript
   <Suspense fallback={<PageLoader />}>
     <Outlet />
   </Suspense>
   ```

3. **Component-level Lazy Loading**
   - Comments load only when user scrolls to them
   - Recommendations fetch after video is visible

4. **Optimized Re-renders**
   - Redux prevents unnecessary component updates
   - Selector functions for derived state

### Backend Optimizations

1. **Database Queries**
   - Indexed fields for faster searches
   - Lean queries for read-only operations
   - Population of references only when needed

2. **Error Handling**
   - Validation at model layer
   - Centralized error handling middleware
   - Proper HTTP status codes

3. **Security**
   - JWT tokens for authentication
   - Password hashing with bcryptjs
   - Input validation on all endpoints

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: "npm: command not found"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

**Problem**: Port 5173 already in use
- **Solution**: Kill existing process or change port in `vite.config.js`
  ```bash
  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

**Problem**: API calls failing
- **Solution**: 
  - Check backend is running on port 5000
  - Verify `VITE_API_URL` in `.env` file
  - Check browser console for errors

### Backend Issues

**Problem**: MongoDB connection error
- **Solution**: 
  - Ensure MongoDB is running: `mongod`
  - Check `MONGODB_URI` in `.env`
  - Verify connection string format

**Problem**: "Cannot find module" errors
- **Solution**: Run `npm install` in Backend directory

**Problem**: Port 5000 already in use
- **Solution**: 
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Change PORT in .env if needed
  ```

**Problem**: JWT token errors
- **Solution**:
  - Clear browser localStorage
  - Log out and log back in
  - Check `JWT_SECRET` in `.env`

### Database Issues

**Problem**: "duplicate key error"
- **Solution**: Run seed script again (clears data first) or delete database

**Problem**: Data not seeding
- **Solution**:
  - Ensure MongoDB is running
  - Delete existing collections first
  - Check seed script logs for errors

---

## 📚 Additional Resources

### Learning Resources
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)

### Project-Specific Docs
- Backend: See `Backend/README.md` for detailed API documentation
- Database: See `Backend/SEED_README.md` for seeding instructions
- API Testing: See `Backend/THUNDERCLIENT_GUIDE.md` for API testing examples

---

## ✅ Checklist for First-Time Setup

- [ ] Node.js and npm installed
- [ ] MongoDB installed and running
- [ ] Cloned/downloaded project
- [ ] Installed frontend dependencies (`npm install`)
- [ ] Installed backend dependencies (`cd Backend && npm install`)
- [ ] Created `.env` file in root YouTube directory
- [ ] Created `.env` file in Backend directory
- [ ] Started MongoDB service
- [ ] Started backend server (`npm start` in Backend)
- [ ] Started frontend dev server (`npm run dev`)
- [ ] Accessed http://localhost:5173
- [ ] Run seed script (`npm run seed` in Backend)
- [ ] Logged in with sample credentials

---

## 📝 License

This project is created for educational purposes.

---

## 👨‍💻 Development Notes

### Adding New Features

1. **Frontend Component**: Create in `src/components/` or `src/pages/`
2. **Backend Endpoint**: Create route, controller, and update model if needed
3. **Redux State**: Update `src/redux/videoSlice.js` if state is needed
4. **Testing**: Use sample data from seed script

### Code Style Guidelines

- Use ES6+ features (arrow functions, destructuring, etc.)
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names
- Follow existing project structure

### Commit Messages

```
feature: Add video search functionality
fix: Resolve like/dislike count bug
docs: Update API documentation
refactor: Simplify video controller logic
```

---

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs in terminal
3. Check browser console for errors
4. Verify `.env` files are correctly configured

---

**Last Updated**: December 2024
**Version**: 1.0.0
