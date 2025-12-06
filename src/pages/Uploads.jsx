import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiService } from '../utils/apiService'
import '../styles/Uploads.css'

export default function Uploads() {
  const user = useSelector(state => state.user.user)
  const [uploadedVideos, setUploadedVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: 'Other',
  })

  useEffect(() => {
    if (user) {
      fetchUserVideos()
    }
  }, [user])

  const fetchUserVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      // Fetch videos for current user - handle both _id and id
      const userId = user._id || user.id
      if (!userId) {
        throw new Error('User ID not found')
      }
      const response = await apiService.videoService.getUserVideos(userId)
      setUploadedVideos(response.videos || response || [])
    } catch (err) {
      console.error('Error fetching user videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await apiService.videoService.deleteVideo(videoId)
        setUploadedVideos(uploadedVideos.filter(v => v._id !== videoId))
      } catch (err) {
        console.error('Error deleting video:', err)
        alert('Failed to delete video')
      }
    }
  }

  const handleEditClick = (video) => {
    setEditingId(video._id)
    setEditData({
      title: video.title,
      description: video.description || '',
      category: video.category || 'Other',
    })
  }

  const handleSaveEdit = async (videoId) => {
    if (!editData.title.trim()) {
      alert('Video title is required')
      return
    }

    try {
      setLoading(true)
      await apiService.videoService.updateVideo(videoId, editData)
      
      // Update local state
      setUploadedVideos(uploadedVideos.map(v =>
        v._id === videoId
          ? { ...v, ...editData }
          : v
      ))
      
      setEditingId(null)
      setEditData({ title: '', description: '', category: 'Other' })
    } catch (err) {
      console.error('Error updating video:', err)
      alert('Failed to update video')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({ title: '', description: '', category: 'Other' })
  }

  if (!user) {
    return (
      <Layout>
        <div className="uploads-page">
          <div className="empty-state">
            <p>Please log in to view your uploads</p>
            <Link to="/login" className="btn-primary">Sign In</Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="uploads-page">
        <div className="uploads-header">
          <h1>Your Videos</h1>
          <button className="upload-btn">📹 Upload New Video</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your videos...</div>
        ) : uploadedVideos.length > 0 ? (
          <div className="uploads-table">
            <table>
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Uploaded</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedVideos.map((video) => (
                  <React.Fragment key={video._id}>
                    {editingId === video._id ? (
                      <tr className="edit-mode">
                        <td colSpan="6">
                          <div className="edit-form">
                            <div className="form-group">
                              <label>Video Title</label>
                              <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                placeholder="Enter video title..."
                              />
                            </div>
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                rows="3"
                                placeholder="Enter video description..."
                              />
                            </div>
                            <div className="form-group">
                              <label>Category</label>
                              <select
                                value={editData.category}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                              >
                                <option>Other</option>
                                <option>Technology</option>
                                <option>Music</option>
                                <option>Gaming</option>
                                <option>Design</option>
                                <option>Education</option>
                                <option>Entertainment</option>
                                <option>Sports</option>
                                <option>News</option>
                              </select>
                            </div>
                            <div className="form-actions">
                              <button
                                className="save-btn"
                                onClick={() => handleSaveEdit(video._id)}
                                disabled={loading}
                              >
                                {loading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="video-cell">
                          <img 
                            src={video.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail'} 
                            alt={video.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail'
                            }}
                          />
                          <div className="video-title-info">
                            <span className="title">{video.title}</span>
                            <span className="description">{video.description?.substring(0, 50)}...</span>
                          </div>
                        </td>
                        <td>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{video.views?.toLocaleString() || 0}</td>
                        <td>{Array.isArray(video.likes) ? video.likes.length : video.likes || 0}</td>
                        <td><span className={`status ${video.status || 'published'}`}>{video.status || 'Published'}</span></td>
                        <td>
                          <Link to={`/video/${video._id}`} className="action-btn">👁️ View</Link>
                          <button 
                            className="action-btn"
                            onClick={() => handleEditClick(video)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(video._id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't uploaded any videos yet</p>
            <Link to="/profile" className="upload-btn-large">📹 Upload Your First Video</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
