import Comment from '../models/Comment.js'
import Video from '../models/Video.js'

// @desc    Get comments for a video
// @route   GET /api/comments/video/:videoId
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ 
      video: req.params.videoId,
      parentComment: null 
    })
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' },
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { text, videoId, parentCommentId } = req.body

    if (!text || !videoId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text and videoId',
      })
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      })
    }

    const comment = await Comment.create({
      text,
      author: req.user.id,
      video: videoId,
      parentComment: parentCommentId || null,
    })

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar')

    // Add comment to video
    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    })

    // If it's a reply, add to parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      })
    }

    res.status(201).json({
      success: true,
      comment: populatedComment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body

    let comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      })
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar')

    res.status(200).json({
      success: true,
      comment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      })
    }

    // Remove from video
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: req.params.id },
    })

    // Remove from parent comment if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: req.params.id },
      })
    }

    await Comment.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Like comment
// @route   PUT /api/comments/:id/like
// @access  Private
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    if (comment.likedBy.includes(req.user.id)) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== req.user.id)
    } else {
      comment.likedBy.push(req.user.id)
    }

    comment.likes = comment.likedBy.length

    await comment.save()

    res.status(200).json({
      success: true,
      comment,
    })
  } catch (error) {
    next(error)
  }
}
