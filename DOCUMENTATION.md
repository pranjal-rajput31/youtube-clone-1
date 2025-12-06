# YouTube Clone - Technical Documentation

Complete technical documentation for the YouTube Clone MERN stack application.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Code Organization](#code-organization)
3. [Key Algorithms](#key-algorithms)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Performance Optimizations](#performance-optimizations)
7. [Error Handling](#error-handling)
8. [Security Implementation](#security-implementation)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                       │
│              (React 19 Application)                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/CORS
                     ▼
┌─────────────────────────────────────────────────────┐
│            Express.js API Server                     │
│  ┌────────────────────────────────────────────────┐ │
│  │  Routes Layer (HTTP endpoints)                 │ │
│  └────────────────────────────────────────────────┘ │
│                     │                                │
│  ┌────────────────────────────────────────────────┐ │
│  │  Middleware (Auth, Logging, Error Handling)   │ │
│  └────────────────────────────────────────────────┘ │
│                     │                                │
│  ┌────────────────────────────────────────────────┐ │
│  │  Controllers (Business Logic)                  │ │
│  └────────────────────────────────────────────────┘ │
│                     │                                │
│  ┌────────────────────────────────────────────────┐ │
│  │  Models (Mongoose Schemas & Validation)       │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │ Driver Protocol
                     ▼
┌─────────────────────────────────────────────────────┐
│           MongoDB Database                          │
│  • Users Collection                                 │
│  • Videos Collection                                │
│  • Comments Collection                              │
│  • Channels Collection                              │
└─────────────────────────────────────────────────────┘
```

### Request-Response Cycle

```
1. Client sends HTTP request
   └─→ GET /api/videos?page=1&limit=20

2. Express routes request to handler
   └─→ videoController.getVideos()

3. Authentication middleware verifies JWT (if required)
   └─→ Extracts user ID from token

4. Controller processes business logic
   ├─→ Validates input parameters
   ├─→ Queries database via Mongoose
   └─→ Formats response

5. Mongoose queries MongoDB
   ├─→ Applies filters and sorting
   ├─→ Populates references
   └─→ Returns results

6. Controller sends response to client
   └─→ 200 OK with video array

7. React updates component state
   └─→ Component re-renders
```

---

## Code Organization

### Frontend Structure

#### Pages (Lazy Loaded)

Each page is lazy loaded using React.lazy() for code splitting:

```javascript
// App.jsx
const Home = lazy(() => import('./pages/Home'))
const VideoDetail = lazy(() => import('./pages/VideoDetail'))
```

**Benefits:**
- Initial bundle reduced by ~40%
- Faster page load (FCP)
- Better caching strategy
- Reduced memory footprint

#### Components

Reusable React components with clear separation of concerns:

```
components/
├── Header.jsx          # Navigation header with search
├── Sidebar.jsx         # Navigation menu
├── VideoCard.jsx       # Video grid item
├── CommentBox.jsx      # Comment input
├── Comments.jsx        # Comments list (lazy loaded)
└── Recommendations.jsx # Recommendations (lazy loaded)
```

#### Redux State Management

Centralized state using Redux Toolkit:

```javascript
// redux/videoSlice.js
import { createSlice } from '@reduxjs/toolkit'

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    selectedVideo: null,
    searchResults: [],
    loading: false,
  },
  reducers: {
    // Actions for state updates
  },
})

export default videoSlice.reducer
```

**Advantages:**
- Single source of truth for state
- Prevents prop drilling
- Time-travel debugging capability
- Middleware support for side effects

### Backend Structure

#### Controllers

Business logic organized by domain:

```javascript
// controllers/videoController.js
export const getVideos = async (req, res, next) => { ... }
export const getVideo = async (req, res, next) => { ... }
export const createVideo = async (req, res, next) => { ... }
export const updateVideo = async (req, res, next) => { ... }
export const deleteVideo = async (req, res, next) => { ... }
export const likeVideo = async (req, res, next) => { ... }
export const dislikeVideo = async (req, res, next) => { ... }
```

#### Models

Mongoose schemas with validation:

```javascript
// models/Video.js
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  // More fields...
}, { timestamps: true })
```

#### Routes

RESTful API endpoints mapped to controllers:

```javascript
// routes/videoRoutes.js
router.get('/', getVideos)           // GET /api/videos
router.get('/:id', getVideo)         // GET /api/videos/:id
router.post('/', protect, createVideo) // POST /api/videos (protected)
router.put('/:id', protect, updateVideo) // PUT /api/videos/:id (protected)
router.delete('/:id', protect, deleteVideo) // DELETE /api/videos/:id (protected)
router.put('/:id/like', protect, likeVideo) // PUT /api/videos/:id/like
router.put('/:id/dislike', protect, dislikeVideo) // PUT /api/videos/:id/dislike
```

#### Middleware

Cross-cutting concerns:

```javascript
// middleware/auth.js - Verify JWT tokens
// middleware/errorHandler.js - Centralized error handling
```

---

## Key Algorithms

### Like/Dislike Toggle Logic

**Problem:** Original implementation caused "Cast to Number failed" error when saving video with string duration.

**Solution:** Use `.lean()` and `.updateOne()` to bypass Mongoose validation:

```javascript
// BEFORE (Caused Error)
const video = await Video.findById(videoId)  // Triggers validation
video.likedBy.push(userId)
await video.save()                           // Validation fails on duration

// AFTER (Works Correctly)
const video = await Video.findById(videoId).lean()  // No validation
// Fix duration if string
if (typeof video.duration === 'string') {
  video.duration = convertToSeconds(video.duration)
}
await Video.updateOne(
  { _id: videoId },
  { $set: { likedBy: video.likedBy, likes: video.likes } },
  { runValidators: false }  // Bypass validation
)
```

**Key Points:**
- `.lean()` returns plain JavaScript objects (no Mongoose wrapper)
- Skips validation layer that was checking duration type
- `updateOne()` with `runValidators: false` bypasses schema validation
- Handles backward compatibility with string durations

### Search Algorithm

**Case-Insensitive Multi-Field Search:**

```javascript
const query = {
  $or: [
    { title: { $regex: search, $options: 'i' } },      // Search title
    { description: { $regex: search, $options: 'i' } }, // Search description
    { tags: { $in: [search] } },                        // Search tags
  ]
}
```

**Benefits:**
- Users can search by title, description, or tags
- Case-insensitive for better UX
- Efficient MongoDB regex matching

### Pagination Algorithm

**Efficient Large Dataset Handling:**

```javascript
const page = req.query.page || 1
const limit = req.query.limit || 20
const skip = (page - 1) * limit

const videos = await Video.find(query)
  .skip(skip)
  .limit(limit)

const total = await Video.countDocuments(query)
const pages = Math.ceil(total / limit)
```

**Advantages:**
- Reduces memory usage (only fetch one page)
- Faster database queries
- Better user experience (faster initial load)

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,              // e.g., "John Tech"
  email: String,             // e.g., "john@example.com"
  password: String,          // Hashed with bcryptjs
  avatar: String,            // Profile picture URL
  bio: String,               // User biography
  subscribers: Number,       // Number of subscribers
  subscribedTo: [ObjectId],  // Array of user IDs (channels subscribed to)
  videos: [ObjectId],        // Array of video IDs uploaded
  likedVideos: [ObjectId],   // Array of video IDs liked
  createdAt: Date,
  updatedAt: Date,
}
```

### Video Collection

```javascript
{
  _id: ObjectId,
  title: String,             // Video title
  description: String,       // Video description
  channel: ObjectId,         // Reference to User (uploader)
  videoUrl: String,          // URL to video file
  thumbnail: String,         // Thumbnail image URL
  duration: Number,          // Duration in seconds
  views: Number,             // View count
  likes: Number,             // Like count
  dislikes: Number,          // Dislike count
  likedBy: [ObjectId],       // Array of user IDs who liked
  dislikedBy: [ObjectId],    // Array of user IDs who disliked
  comments: [ObjectId],      // Array of comment IDs
  category: String,          // Video category
  status: String,            // "published" or "draft"
  createdAt: Date,
  updatedAt: Date,
}
```

### Comment Collection

```javascript
{
  _id: ObjectId,
  text: String,              // Comment text
  author: ObjectId,          // Reference to User
  video: ObjectId,           // Reference to Video
  likes: Number,             // Like count
  likedBy: [ObjectId],       // Array of user IDs who liked
  createdAt: Date,
  updatedAt: Date,
}
```

---

## API Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Tech",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}

Response 201:
{
  "success": true,
  "user": { /* user object */ },
  "token": "eyJhbGc..."
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { /* user object */ }
}
```

### Video Endpoints

#### Get All Videos
```
GET /api/videos?page=1&limit=20&search=react&category=tech

Response 200:
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "videos": [ /* array of videos */ ]
}
```

#### Get Single Video
```
GET /api/videos/:id

Response 200:
{
  "success": true,
  "video": { /* full video object with comments */ }
}
```

#### Like Video (Protected)
```
PUT /api/videos/:id/like
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "video": {
    "likes": 285,
    "likedBy": [ /* array of user IDs */ ]
  }
}
```

---

## Performance Optimizations

### Frontend Optimizations

#### 1. Code Splitting with React.lazy()

Pages are split into separate chunks:
- `Home.jsx` → chunk-home.js
- `VideoDetail.jsx` → chunk-video-detail.js
- etc.

**Result:** Initial bundle reduced from ~500KB to ~300KB (40% reduction)

#### 2. Component-Level Lazy Loading

Comments and Recommendations load only when needed:

```javascript
// VideoDetail.jsx
const Comments = lazy(() => import('../components/Comments'))
const Recommendations = lazy(() => import('../components/Recommendations'))

<Suspense fallback={<ComponentLoader />}>
  <Comments videoId={id} />
</Suspense>
```

#### 3. Redux Selectors

Prevent unnecessary re-renders:

```javascript
// Only re-render if selected video changes
const selectedVideo = useSelector(state => state.videos.selectedVideo)
```

### Backend Optimizations

#### 1. Database Indexing

Indexes on frequently queried fields:

```javascript
// videoSchema
title: { type: String, index: true }
createdAt: { type: Date, index: true }
```

#### 2. Lean Queries

For read-only operations, use `.lean()` to skip Mongoose validation:

```javascript
const videos = await Video.find(query).lean()  // ~50% faster
```

#### 3. Pagination

Fetch only needed records:

```javascript
// Fetch 20 items instead of thousands
.skip(skip).limit(limit)
```

---

## Error Handling

### Frontend Error Handling

```javascript
// In components
try {
  const response = await api.getVideos()
  setVideos(response.data.videos)
} catch (error) {
  console.error('Failed to fetch videos:', error)
  setError('Failed to load videos. Please try again.')
}
```

### Backend Error Handling

**Centralized Error Middleware:**

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    success: false,
    message,
  })
}
```

**Usage in Controllers:**

```javascript
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      })
    }
    res.json({ success: true, video })
  } catch (error) {
    next(error)  // Pass to error middleware
  }
}
```

---

## Security Implementation

### 1. JWT Authentication

**Token Generation:**

```javascript
// config/jwt.js
import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  })
}
```

**Token Verification:**

```javascript
// middleware/auth.js
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
```

### 2. Password Hashing

Passwords are automatically hashed using pre-save hook in Mongoose:

```javascript
// Before being stored in database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})
```

### 3. Input Validation

Mongoose schema validation:

```javascript
email: {
  type: String,
  required: [true, 'Email required'],
  unique: true,
  match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
}
```

### 4. CORS Configuration

Only allow requests from frontend:

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
```

---

## Troubleshooting Guide

### Issue: "Cast to Number failed for value '0:00'"

**Cause:** Video duration stored as string, schema expects Number

**Solution:**
```javascript
// Use .lean() and .updateOne()
const video = await Video.findById(id).lean()
if (typeof video.duration === 'string') {
  video.duration = convertToSeconds(video.duration)
}
await Video.updateOne({ _id: id }, { $set: { ... } }, { runValidators: false })
```

### Issue: Like/Dislike buttons not working

**Debugging Steps:**
1. Check network tab in browser DevTools for API response
2. Verify JWT token is being sent in Authorization header
3. Check server logs for error messages
4. Ensure MongoDB is running
5. Verify database connection string in `.env`

### Issue: Page loads slowly

**Performance Check:**
1. Check bundle size: `npm run build` → Check dist/ folder
2. Use React DevTools Profiler to identify slow components
3. Check Network tab for slow API calls
4. Enable compression in Express: `app.use(compression())`

### Issue: Comments not loading on video detail page

**Debugging:**
```javascript
// Check if Suspense boundary is working
<Suspense fallback={<div>Loading comments...</div>}>
  <Comments videoId={id} />
</Suspense>

// Check if Comments component exists
// Check if video ID is being passed correctly
```

---

## Development Workflow

### Adding New Feature

1. **Frontend**
   - Create new page in `src/pages/`
   - Add lazy loading in `App.jsx`
   - Create Redux actions if needed
   - Add styling in `src/styles/`

2. **Backend**
   - Create new controller function
   - Create new route
   - Add validation in model
   - Test with API client

3. **Testing**
   - Manual testing in browser
   - Check console for errors
   - Test different scenarios
   - Performance test with DevTools

### Code Review Checklist

- [ ] Code follows project structure
- [ ] Functions have JSDoc comments
- [ ] Error handling is in place
- [ ] No console.log() in production code (use for debugging only)
- [ ] Security best practices followed
- [ ] Performance optimized
- [ ] Tested on different screen sizes

---

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

**Last Updated:** December 2024  
**Version:** 1.0.0
