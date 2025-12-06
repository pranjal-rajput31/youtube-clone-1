import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchVideos } from '../store/videoSlice'
import Layout from '../components/Layout'
import VideoCard from '../components/VideoCard'
import '../styles/Home.css'

const CATEGORIES = [
  'All',
  'Technology',
  'Music',
  'Gaming',
  'Design',
  'Education',
  'Entertainment',
  'Sports',
  'News',
]

export default function Home() {
  const dispatch = useDispatch()
  const videos = useSelector(state => state.videos.videos)
  const loading = useSelector(state => state.videos.loading)
  const error = useSelector(state => state.videos.error)
  const searchQuery = useSelector(state => state.ui.searchQuery)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchParams] = useSearchParams()

  // Watch for search query changes from header
  useEffect(() => {
    const category = selectedCategory === 'All' ? '' : selectedCategory
    const search = searchQuery || searchParams.get('q') || ''
    
    // Always fetch videos, either all or filtered by category/search
    dispatch(fetchVideos({ 
      page: 1, 
      search, 
      category 
    }))
  }, [dispatch, selectedCategory, searchQuery, searchParams])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  return (
    <Layout>
      <div className="home-page">
        <div className="feed-container">
          <div className="filters-section">
            <div className="filter-buttons">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <h1>
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedCategory !== 'All' ? selectedCategory : 'Home'}
          </h1>
          
          {loading && <p className="loading">Loading videos...</p>}
          {error && <p className="error">Error: {error}</p>}
          
          <div className="videos-grid">
            {videos && videos.length > 0
              ? videos.map((video) => (
                  <VideoCard key={video._id || video.id} video={video} />
                ))
              : !loading && (
                  <p className="no-videos">No videos found. Try a different search or category.</p>
                )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
