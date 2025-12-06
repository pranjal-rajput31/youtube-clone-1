/**
 * server.js - Express Application Entry Point
 * 
 * This file sets up the Express server with:
 * 1. Environment configuration (dotenv)
 * 2. Database connection (MongoDB)
 * 3. Middleware setup (CORS, JSON parsing, etc.)
 * 4. Route configuration (all API endpoints)
 * 5. Error handling (centralized error middleware)
 * 6. Server startup on specified port
 * 
 * Flow:
 * Environment Variables → Database Connection → Middleware → Routes → Error Handlers → Server Listen
 */

// Load environment variables from .env file
// Must be first import to ensure all env vars are available
import dotenv from 'dotenv'
dotenv.config()

// Import core dependencies
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// Import configuration and middleware
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// Import all API routes
import authRoutes from './routes/authRoutes.js'
import videoRoutes from './routes/videoRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import channelRoutes from './routes/channelRoutes.js'

/**
 * Initialize Express Application
 * Create app instance that will handle all HTTP requests
 */
const app = express()

/**
 * Connect to MongoDB Database
 * Established connection before server starts listening for requests
 * See: config/db.js for connection details
 */
connectDB()

/**
 * Middleware Configuration
 * 
 * Middleware processes all incoming requests before they reach route handlers.
 * Order matters - CORS must be before routes.
 */

// CORS Middleware
// Allows frontend to make requests to backend from different origins
// Configured to accept requests from CLIENT_URL (typically http://localhost:5173)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allows cookies and authorization headers
}))

// Body Parser Middleware
// Converts incoming JSON and URL-encoded data to JavaScript objects
// 10mb limit prevents huge payload attacks
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

/**
 * Health Check Endpoint
 * 
 * Simple GET endpoint to verify server is running.
 * Useful for:
 * - Checking server status
 * - Load balancer health checks
 * - Monitoring and alerting
 * 
 * Usage: curl http://localhost:5000/api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

/**
 * Route Registration
 * 
 * Mount all API routes with their prefixes.
 * Each route file contains multiple endpoints grouped by feature.
 * 
 * Routes:
 * - /api/auth - User authentication (register, login, logout)
 * - /api/videos - Video operations (CRUD, like, dislike, search)
 * - /api/comments - Comment management (CRUD, like)
 * - /api/users - User profile operations
 * - /api/channels - Channel information and management
 */
app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/channels', channelRoutes)

/**
 * Error Handling Middleware
 * 
 * These must be last in middleware chain to catch all errors.
 * - notFound: Handles 404 requests (routes that don't exist)
 * - errorHandler: Catches and formats all errors
 * 
 * See: middleware/errorHandler.js for implementation
 */
app.use(notFound)
app.use(errorHandler)


/**
 * Server Startup
 * 
 * Retrieve port from environment or use default 5000
 * Listen for incoming HTTP requests on specified port
 */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app

/**
 * Architecture Notes:
 * 
 * Client Request Flow:
 * 1. Browser makes HTTP request to server
 * 2. CORS middleware checks if origin is allowed
 * 3. Body parser converts JSON/form data to objects
 * 4. Request matches against routes
 * 5. Route handler (controller) processes request
 * 6. Controller queries database via mongoose
 * 7. Response sent back to client
 * 8. Error handler catches any failures
 * 
 * Key Design Principles:
 * - Separation of concerns (routes, controllers, models)
 * - Centralized error handling
 * - Middleware for cross-cutting concerns
 * - RESTful API design
 * - Stateless authentication with JWT
 * 
 * Security Features:
 * - CORS configured for specific origin
 * - JWT token validation (in auth middleware)
 * - Input validation (in controllers)
 * - Mongoose schema validation
 * - Environment variables for secrets
 * 
 * Scalability Considerations:
 * - Stateless design allows horizontal scaling
 * - Database connection pooling via mongoose
 * - Async/await prevents blocking operations
 * - Error handling prevents server crashes
 */
