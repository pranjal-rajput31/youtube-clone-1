/**
 * videoController.js - Video Operations Controller
 * 
 * This controller handles all video-related operations:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Likes and Dislikes
 * - Video search and filtering
 * - View count updates
 * 
 * Architecture:
 * - Each function is an async route handler
 * - Functions receive (req, res, next) from Express
 * - Uses try-catch for error handling
 * - Passes errors to next() for centralized error middleware
 * - Returns JSON responses to client
 */

import Video from '../models/Video.js'
import User from '../models/User.js'

/**
 * Get All Videos - Public Endpoint
 * 
 * GET /api/videos
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 20)
 * - search: Search in title, description, tags
 * - category: Filter by category
 * 
 * Returns: Paginated list of published videos
 * 
 * Performance Optimizations:
 * - Populates only necessary channel fields (name, avatar, subscribers)
 * - Sorts by creation date (newest first)
 * - Implements pagination to limit database load
 * - Case-insensitive search for better UX
 */
export const getVideos = async (req, res, next) => {
  try {
    // Extract query parameters with defaults
    const { page = 1, limit = 20, search, category } = req.query

    // Build query filter
    let query = { status: 'published' }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },        // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search] } },
      ]
    }

    // Add category filter if provided
    if (category) {
      query.category = category
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Query database with filters and pagination
    const videos = await Video.find(query)
      .populate('channel', 'name avatar subscribers')  // Get channel info
      .sort({ createdAt: -1 })                          // Newest first
      .skip(skip)
      .limit(parseInt(limit))

    // Get total count for pagination info
    const total = await Video.countDocuments(query)

    res.status(200).json({
      success: true,
      count: videos.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      videos,
    })
  } catch (error) {
    next(error)  // Pass to error handler middleware
  }
}

/**
 * Get Single Video - Public Endpoint
 * 
 * GET /api/videos/:id
 * 
 * Returns: Full video details with:
 * - Channel information
 * - All comments with author details
 * - Updated view count
 * 
 * Side Effect:
 * - Increments video view count by 1
 * - Updates done atomically with findByIdAndUpdate
 * 
 * Performance Note:
 * - View count update happens regardless of populated data
 * - Prevents view count being affected by failed queries
 */
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },  // Increment views by 1
      { new: true }             // Return updated document
    )
      .populate('channel', 'name avatar subscribers bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
      })

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      })
    }

    res.status(200).json({
      success: true,
      video,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create video (user uploads)
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res, next) => {
  try {
    const { title, description, videoUrl, thumbnail, duration, tags, category } = req.body

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and video URL',
      })
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      tags: tags || [],
      category: category || 'Other',
      channel: req.user.id,
    })

    // Add video to user's videos array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { videos: video._id },
    })

    res.status(201).json({
      success: true,
      video,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res, next) => {
  try {
    let video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      })
    }

    // Check ownership
    if (video.channel.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this video',
      })
    }

    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      video,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      })
    }

    // Check ownership
    if (video.channel.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video',
      })
    }

    await Video.findByIdAndDelete(req.params.id)

    // Remove video from user's videos array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { videos: req.params.id },
    })

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Like Video - Protected Endpoint
 * 
 * PUT /api/videos/:id/like
 * Requires: Authentication (JWT token)
 * 
 * Functionality:
 * 1. If user hasn't liked: Add to likedBy, remove from dislikedBy if exists
 * 2. If user already liked: Remove from likedBy (toggle off)
 * 3. Update video like/dislike counts
 * 4. Sync user's likedVideos array
 * 
 * Database Optimization:
 * - Uses .lean() to fetch raw objects (skip Mongoose validation layer)
 * - Updates with runValidators: false to avoid validation errors
 * - Handles string duration conversion for backward compatibility
 * 
 * Bug Fix Note:
 * - OLD: Used findById() + save() which triggered Mongoose validation
 *   - Error: "Cast to Number failed for value '0:00'" (duration was string)
 * - NEW: Uses .lean() + .updateOne() to bypass validation layer
 *   - Converts string duration to seconds if needed
 *   - Bypasses schema validation that was failing
 * 
 * @param {string} req.params.id - Video ID
 * @param {string} req.user.id - Authenticated user ID
 * @returns {object} Updated video object
 */
export const likeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id
    const userId = req.user.id
    
    console.log('\n=== LIKE VIDEO ===')
    console.log('User:', userId, 'Video:', videoId)

    // Get raw video data - .lean() skips Mongoose validation layer
    // This prevents "Cast to Number failed" errors from string duration field
    const video = await Video.findById(videoId).select('+duration').lean()

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' })
    }

    // Fix duration if it's a string (for backward compatibility with old data)
    // Database might have duration as "MM:SS" string, needs to be seconds (Number)
    if (typeof video.duration === 'string') {
      const parts = (video.duration || '0:0').split(':')
      video.duration = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
    }
    if (!video.duration || isNaN(video.duration)) video.duration = 0

    // Initialize arrays if they don't exist
    video.likedBy = Array.isArray(video.likedBy) ? video.likedBy : []
    video.dislikedBy = Array.isArray(video.dislikedBy) ? video.dislikedBy : []

    // Check if user already liked this video
    const userIdStr = userId.toString()
    const isLiked = video.likedBy.some(id => id.toString() === userIdStr)

    if (isLiked) {
      // User already liked - remove the like (toggle off)
      video.likedBy = video.likedBy.filter(id => id.toString() !== userIdStr)
      video.likes = video.likedBy.length
    } else {
      // User hasn't liked - add the like
      
      // If user had disliked, remove dislike first
      if (video.dislikedBy.some(id => id.toString() === userIdStr)) {
        video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userIdStr)
        video.dislikes = video.dislikedBy.length
      }
      
      // Add to likedBy
      video.likedBy.push(userId)
      video.likes = video.likedBy.length
    }

    // Update database with raw update (bypass validation)
    // runValidators: false prevents "Cast to Number failed" error
    await Video.updateOne({ _id: videoId }, {
      $set: { likedBy: video.likedBy, likes: video.likes, dislikedBy: video.dislikedBy, dislikes: video.dislikes }
    }, { runValidators: false })

    // Sync user's likedVideos array
    const user = await User.findById(userId)
    user.likedVideos = Array.isArray(user.likedVideos) ? user.likedVideos : []
    
    // Toggle user's liked videos array
    if (user.likedVideos.some(id => id.toString() === videoId.toString())) {
      user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId.toString())
    } else {
      user.likedVideos.push(videoId)
    }
    await user.save()

    console.log('Saved - likes:', video.likes, 'dislikes:', video.dislikes)
    console.log('=== END LIKE ===\n')

    res.status(200).json({ success: true, video })
  } catch (error) {
    console.error('Like error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Dislike Video - Protected Endpoint
 * 
 * PUT /api/videos/:id/dislike
 * Requires: Authentication (JWT token)
 * 
 * Functionality:
 * - Mirror of likeVideo but with dislike logic
 * - If user hasn't disliked: Add to dislikedBy, remove from likedBy if exists
 * - If user already disliked: Remove from dislikedBy (toggle off)
 */
export const dislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id
    const userId = req.user.id
    
    console.log('\n=== DISLIKE VIDEO ===')
    console.log('User:', userId, 'Video:', videoId)

    // Get raw video data - .lean() skips Mongoose validation layer
    const video = await Video.findById(videoId).select('+duration').lean()

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' })
    }

    // Fix duration if it's a string (same as likeVideo)
    if (typeof video.duration === 'string') {
      const parts = (video.duration || '0:0').split(':')
      video.duration = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
    }
    if (!video.duration || isNaN(video.duration)) video.duration = 0

    // Initialize arrays if they don't exist
    video.likedBy = Array.isArray(video.likedBy) ? video.likedBy : []
    video.dislikedBy = Array.isArray(video.dislikedBy) ? video.dislikedBy : []

    // Check if user already disliked this video
    const userIdStr = userId.toString()
    const isDisliked = video.dislikedBy.some(id => id.toString() === userIdStr)

    if (isDisliked) {
      // User already disliked - remove the dislike (toggle off)
      video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userIdStr)
      video.dislikes = video.dislikedBy.length
    } else {
      // User hasn't disliked - add the dislike
      
      // If user had liked, remove like first
      if (video.likedBy.some(id => id.toString() === userIdStr)) {
        video.likedBy = video.likedBy.filter(id => id.toString() !== userIdStr)
        video.likes = video.likedBy.length
      }
      
      // Add to dislikedBy
      video.dislikedBy.push(userId)
      video.dislikes = video.dislikedBy.length
    }

    // Update database with raw update (bypass validation)
    await Video.updateOne({ _id: videoId }, {
      $set: { likedBy: video.likedBy, likes: video.likes, dislikedBy: video.dislikedBy, dislikes: video.dislikes }
    }, { runValidators: false })

    console.log('Saved - likes:', video.likes, 'dislikes:', video.dislikes)
    console.log('=== END DISLIKE ===\n')

    res.status(200).json({ success: true, video })
  } catch (error) {
    console.error('Dislike error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}
