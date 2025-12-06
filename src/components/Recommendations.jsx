import React from 'react'
import VideoCard from './VideoCard'
import '../styles/Recommendations.css'

export default function Recommendations({ currentVideoId, videos }) {
  const recommendations = videos
    .filter(v => {
      const videoId = v._id || v.id
      return videoId !== currentVideoId
    })
    .slice(0, 10)

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations">
        <h2>Recommended</h2>
        <div className="recommendations-list">
          <p>No recommendations available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recommendations">
      <h2>Recommended</h2>
      <div className="recommendations-list">
        {recommendations.map((video) => {
          const videoId = video._id || video.id
          return (
            <div key={videoId} className="recommendation-item">
              <VideoCard video={video} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
