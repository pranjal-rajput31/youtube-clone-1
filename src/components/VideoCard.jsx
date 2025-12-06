import React from 'react'
import { Link } from 'react-router-dom'
import { formatDuration } from '../utils/helpers'
import '../styles/VideoCard.css'

export default function VideoCard({ video }) {
  const videoId = video._id || video.id
  const channelName = video.channel?.name || video.channel || 'Unknown'
  const thumbnail = video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'

  const formatViews = (views) => {
    if (!views) return '0'
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
    return views.toString()
  }

  const getTimeAgo = (date) => {
    if (!date) return 'recently'
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }

  return (
    <Link to={`/video/${videoId}`} className="video-card">
      <div className="video-thumbnail">
        <img 
          src={thumbnail} 
          alt={video.title}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/320x180?text=Video' }}
        />
        <div className="video-duration">
          {typeof video.duration === 'number' 
            ? formatDuration(video.duration)
            : (video.duration || '0:00')}
        </div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-channel">{channelName}</p>
        <p className="video-stats">
          {formatViews(video.views)} views • {getTimeAgo(video.createdAt)}
        </p>
      </div>
    </Link>
  )
}
