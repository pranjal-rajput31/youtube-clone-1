import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVideoById, likeVideoAsync, dislikeVideoAsync } from '../store/videoSlice'
import { subscribeChannelAsync } from '../store/userSlice'
import Layout from '../components/Layout'
import { mockVideos } from '../utils/mockData'
import '../styles/VideoDetail.css'

// Lazy load heavy components
const Comments = lazy(() => import('../components/Comments'))
const Recommendations = lazy(() => import('../components/Recommendations'))

const ComponentLoader = () => (
  <div style={{ padding: '20px', color: '#999' }}>Loading...</div>
)

export default function VideoDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const video = useSelector(state => state.videos.selectedVideo)
  const videos = useSelector(state => state.videos.videos)
  const loading = useSelector(state => state.videos.loading)
  const user = useSelector(state => state.user.user)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  useEffect(() => {
    dispatch(fetchVideoById(id))
  }, [id, dispatch])

  useEffect(() => {
    if (video && user) {
      const userId = user._id || user.id
      setIsLiked(video.likedBy && video.likedBy.some(id => 
        id === userId || id.toString() === userId
      ))
      setIsDisliked(video.dislikedBy && video.dislikedBy.some(id => 
        id === userId || id.toString() === userId
      ))
    }
  }, [video, user])

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like videos')
      return
    }
    try {
      console.log('Liking video:', id, 'User:', user)
      const result = await dispatch(likeVideoAsync(id))
      console.log('Like result:', result)
      // Redux will automatically update the selectedVideo with the new data
      // The component will re-render with updated likes/dislikes
    } catch (err) {
      console.error('Error liking video:', err)
      alert('Failed to like video: ' + err.message)
    }
  }

  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike videos')
      return
    }
    try {
      console.log('Disliking video:', id, 'User:', user)
      const result = await dispatch(dislikeVideoAsync(id))
      console.log('Dislike result:', result)
      // Redux will automatically update the selectedVideo with the new data
      // The component will re-render with updated likes/dislikes
    } catch (err) {
      console.error('Error disliking video:', err)
      alert('Failed to dislike video: ' + err.message)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe')
      return
    }
    dispatch(subscribeChannelAsync(video.channel._id))
    setIsSubscribed(!isSubscribed)
  }

  if (loading) {
    return <Layout><div className="loading">Loading video...</div></Layout>
  }

  if (!video) {
    return <Layout><div className="error">Video not found</div></Layout>
  }

  return (
    <Layout>
      <div className="video-detail-page">
        <div className="video-container">
          <div className="video-player">
            <iframe
              width="100%"
              height="600"
              src={video.videoUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-meta">
            <h1 className="video-title">{video.title}</h1>

            <div className="video-actions">
              <button
                className={`action-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                👍 {video.likes}
              </button>
              <button 
                className={`action-btn ${isDisliked ? 'disliked' : ''}`}
                onClick={handleDislike}
              >
                👎 {video.dislikes}
              </button>
              <button className="action-btn">
                🔗 Share
              </button>
              <button className="action-btn">
                💾 Save
              </button>
            </div>

            <div className="video-channel-info">
              <div className="channel-header">
                <div className="channel-avatar">{video.channel?.avatar || '🎬'}</div>
                <div className="channel-details">
                  <h3>{video.channel?.name || 'Unknown Channel'}</h3>
                  <p>{video.channel?.subscribers?.toLocaleString() || 0} subscribers</p>
                </div>
              </div>
              <button
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="video-description">
              <p>{video.description}</p>
              <p className="view-info">
                {video.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="comments-container">
            <Suspense fallback={<ComponentLoader />}>
              <Comments videoId={video._id || video.id} />
            </Suspense>
          </div>
        </div>

        <div className="recommendations-container">
          <Suspense fallback={<ComponentLoader />}>
            <Recommendations 
              currentVideoId={video._id || video.id} 
              videos={videos.length > 0 ? videos : mockVideos} 
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  )
}
