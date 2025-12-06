import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, fetchUserProfile } from '../store/userSlice'
import Layout from '../components/Layout'
import { apiService } from '../utils/apiService'
import '../styles/Profile.css'

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const [channel, setChannel] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingChannel, setIsCreatingChannel] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  })
  const [channelData, setChannelData] = useState({
    channelName: '',
    description: '',
  })
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    duration: '',
    category: 'Other',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      fetchUserChannel()
    }
  }, [user, navigate])

  const fetchUserChannel = async () => {
    try {
      const userId = user._id || user.id
      const response = await apiService.channelService.getUserChannel(userId)
      setChannel(response.channel)
    } catch (err) {
      console.log('No channel found')
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      const updateData = {
        name: formData.name,
        bio: formData.bio,
      }
      await apiService.userService.updateProfile(updateData)
      dispatch(fetchUserProfile())
      setIsEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChannel = async () => {
    if (!channelData.channelName.trim()) {
      setError('Channel name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await apiService.channelService.createChannel({
        channelName: channelData.channelName,
        description: channelData.description,
      })
      setChannel(response.channel)
      setIsCreatingChannel(false)
      setChannelData({ channelName: '', description: '' })
      setSuccess('Channel created successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error creating channel:', err)
      setError(err.response?.data?.message || 'Failed to create channel')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleUploadVideo = async () => {
    if (!channel) {
      setError('Please create a channel first')
      return
    }

    if (!videoData.title.trim()) {
      setError('Video title is required')
      return
    }

    if (!videoData.videoUrl.trim()) {
      setError('Video URL is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const uploadPayload = {
        title: videoData.title,
        description: videoData.description,
        videoUrl: videoData.videoUrl,
        thumbnail: videoData.thumbnail,
        category: videoData.category,
      }
      
      // Convert duration string (MM:SS) to seconds if provided
      if (videoData.duration.trim()) {
        const parts = videoData.duration.split(':')
        if (parts.length === 2) {
          const minutes = parseInt(parts[0], 10)
          const seconds = parseInt(parts[1], 10)
          uploadPayload.duration = minutes * 60 + seconds
        }
      }
      
      await apiService.videoService.createVideo(uploadPayload)
      setIsUploadingVideo(false)
      setVideoData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnail: '',
        duration: '',
        category: 'Other',
      })
      setSuccess('Video uploaded successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error uploading video:', err)
      setError('Failed to upload video')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="profile-page">
          <div className="loading">Loading profile...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="profile-page">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Channel Banner and Header */}
        {channel && (
          <div className="channel-header">
            <div className="channel-banner" style={{
              backgroundImage: channel.channelBanner ? `url(${channel.channelBanner})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
            </div>
            <div className="channel-info">
              <div className="channel-avatar">
                {channel.channelName?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="channel-details">
                <h1>{channel.channelName}</h1>
                <p className="channel-owner">by {user.name}</p>
                <p className="channel-subscribers">
                  {channel.subscribers?.toLocaleString() || 0} subscribers
                </p>
                {channel.description && (
                  <p className="channel-description">{channel.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h2>Personal Account</h2>
            <p className="email">{user.email}</p>
            {user.bio && <p className="bio">{user.bio}</p>}
          </div>
          <div className="profile-actions">
            <button
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              ✏️ {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-profile">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                placeholder="Tell your viewers about you..."
              />
            </div>
            <div className="form-actions">
              <button 
                className="save-btn" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !channel ? (
          <div className="create-channel-section">
            <h2>Create Your Channel</h2>
            {isCreatingChannel ? (
              <div className="create-channel">
                <div className="form-group">
                  <label>Channel Name *</label>
                  <input
                    type="text"
                    value={channelData.channelName}
                    onChange={(e) => setChannelData({ ...channelData, channelName: e.target.value })}
                    placeholder="Enter your channel name..."
                  />
                </div>
                <div className="form-group">
                  <label>Channel Description</label>
                  <textarea
                    value={channelData.description}
                    onChange={(e) => setChannelData({ ...channelData, description: e.target.value })}
                    rows="4"
                    placeholder="Describe your channel..."
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="save-btn"
                    onClick={handleCreateChannel}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Channel'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setIsCreatingChannel(false)
                      setChannelData({ channelName: '', description: '' })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="create-channel-btn"
                onClick={() => setIsCreatingChannel(true)}
              >
                🎬 Create Channel
              </button>
            )}
          </div>
        ) : (
          <div className="upload-video-section">
            <h2>Your Videos</h2>
            {isUploadingVideo ? (
              <div className="upload-video-form">
                <div className="form-group">
                  <label>Video Title *</label>
                  <input
                    type="text"
                    value={videoData.title}
                    onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                    placeholder="Enter video title..."
                  />
                </div>
                <div className="form-group">
                  <label>Video Description</label>
                  <textarea
                    value={videoData.description}
                    onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                    rows="3"
                    placeholder="Describe your video..."
                  />
                </div>
                <div className="form-group">
                  <label>Video URL *</label>
                  <input
                    type="text"
                    value={videoData.videoUrl}
                    onChange={(e) => setVideoData({ ...videoData, videoUrl: e.target.value })}
                    placeholder="Enter video URL or embed link..."
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    value={videoData.thumbnail}
                    onChange={(e) => setVideoData({ ...videoData, thumbnail: e.target.value })}
                    placeholder="Enter thumbnail URL..."
                  />
                </div>
                <div className="form-group">
                  <label>Duration (MM:SS)</label>
                  <input
                    type="text"
                    value={videoData.duration}
                    onChange={(e) => setVideoData({ ...videoData, duration: e.target.value })}
                    placeholder="e.g., 12:34"
                    pattern="\d{1,3}:\d{2}"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={videoData.category}
                    onChange={(e) => setVideoData({ ...videoData, category: e.target.value })}
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
                    onClick={handleUploadVideo}
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload Video'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setIsUploadingVideo(false)
                      setVideoData({
                        title: '',
                        description: '',
                        videoUrl: '',
                        thumbnail: '',
                        category: 'Other',
                      })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="upload-btn-large"
                onClick={() => setIsUploadingVideo(true)}
              >
                📹 Upload New Video
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
