import React from 'react'
import { useSelector } from 'react-redux'
import { commentService } from '../utils/apiService'
import '../styles/Comments.css'

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: 'John Doe',
    avatar: '👤',
    text: 'Great video! Really helpful.',
    likes: 42,
    replies: 3,
    daysAgo: 2,
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: '👩',
    text: 'Thanks for sharing this!',
    likes: 28,
    replies: 1,
    daysAgo: 1,
  },
  {
    id: 3,
    author: 'Tech Enthusiast',
    avatar: '🧑',
    text: 'Could you make a tutorial on this?',
    likes: 15,
    replies: 0,
    daysAgo: 0,
  },
]

export default function Comments({ videoId }) {
  const [comments, setComments] = React.useState(INITIAL_COMMENTS)
  const [newComment, setNewComment] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [editingId, setEditingId] = React.useState(null)
  const [editText, setEditText] = React.useState('')
  const user = useSelector(state => state.user.user)

  React.useEffect(() => {
    if (videoId) {
      fetchComments()
    }
  }, [videoId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await commentService.getComments(videoId)
      if (data.comments && data.comments.length > 0) {
        setComments(data.comments)
      }
    } catch (error) {
      console.log('Using sample comments')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to comment')
      return
    }
    if (newComment.trim()) {
      try {
        const data = await commentService.createComment(newComment, videoId)
        if (data.comment) {
          setComments([data.comment, ...comments])
        } else {
          // Fallback for demo
          setComments([
            {
              id: comments.length + 1,
              author: user.name,
              avatar: '😊',
              text: newComment,
              likes: 0,
              replies: 0,
              daysAgo: 0,
            },
            ...comments,
          ])
        }
        setNewComment('')
      } catch (error) {
        console.error('Failed to add comment')
      }
    }
  }

  // Helper function to get author name
  const getAuthorName = (author) => {
    if (typeof author === 'string') {
      return author
    }
    if (author && typeof author === 'object') {
      return author.name || 'Anonymous'
    }
    return 'Anonymous'
  }

  // Helper function to get author ID
  const getAuthorId = (author) => {
    if (typeof author === 'string') {
      return null
    }
    if (author && typeof author === 'object') {
      return author._id
    }
    return null
  }

  // Check if current user is the comment owner
  const isCommentOwner = (comment) => {
    const authorId = getAuthorId(comment.author)
    return user && (user._id === authorId || user.id === authorId)
  }

  const handleEditComment = (comment) => {
    setEditingId(comment._id || comment.id)
    setEditText(comment.text)
  }

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) {
      alert('Comment cannot be empty')
      return
    }
    
    try {
      // Call API to update comment on backend
      await commentService.updateComment(commentId, editText)
      
      // Update local comment
      setComments(comments.map(c => 
        (c._id || c.id) === commentId 
          ? { ...c, text: editText }
          : c
      ))
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.error('Failed to edit comment:', error)
      alert('Failed to edit comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        // Call API to delete comment on backend
        await commentService.deleteComment(commentId)
        
        // Remove from local state
        setComments(comments.filter(c => (c._id || c.id) !== commentId))
      } catch (error) {
        console.error('Failed to delete comment:', error)
        alert('Failed to delete comment')
      }
    }
  }

  return (
    <div className="comments-section">
      <h2>Comments</h2>

      <form className="comment-form" onSubmit={handleAddComment}>
        <div className="comment-avatar">😊</div>
        <div className="comment-input-wrapper">
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="comment-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setNewComment('')}
            >
              Cancel
            </button>
            <button type="submit" className="comment-btn">
              Comment
            </button>
          </div>
        </div>
      </form>

      <div className="comments-list">
        {comments.map((comment) => {
          const commentId = comment._id || comment.id
          const authorName = getAuthorName(comment.author)
          const isLikeArray = Array.isArray(comment.likes)
          const likeCount = isLikeArray ? comment.likes.length : (comment.likes || 0)
          const isOwner = isCommentOwner(comment)
          const isEditing = editingId === commentId

          return (
            <div key={commentId} className="comment-item">
              <div className="comment-avatar">{comment.avatar || '💬'}</div>
              <div className="comment-content">
                <div className="comment-header">
                  <strong>{authorName}</strong>
                  <span className="comment-date">
                    {comment.daysAgo === 0 ? 'today' : `${comment.daysAgo} days ago`}
                  </span>
                </div>
                
                {isEditing ? (
                  <div className="comment-edit-mode">
                    <input
                      type="text"
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSaveEdit(commentId)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.text}</p>
                )}

                <div className="comment-actions-bottom">
                  <button className="action-btn">
                    <span>👍</span> {likeCount}
                  </button>
                  <button className="action-btn">
                    <span>👎</span>
                  </button>
                  <button className="action-btn">Reply</button>
                  
                  {isOwner && (
                    <>
                      {!isEditing && (
                        <>
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditComment(comment)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteComment(commentId)}
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
