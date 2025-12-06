import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFilteredVideos } from '../store/videoSlice'
import Layout from '../components/Layout'
import VideoCard from '../components/VideoCard'
import { mockVideos } from '../utils/mockData'
import '../styles/Search.css'

export default function Search() {
  const dispatch = useDispatch()
  const searchQuery = useSelector(state => state.ui.searchQuery)
  const videos = useSelector(state => state.videos.videos)
  const filteredVideos = useSelector(state => state.videos.filteredVideos)

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const results = (videos.length > 0 ? videos : mockVideos).filter(
        v => v.title.toLowerCase().includes(query) ||
             v.channel.toLowerCase().includes(query) ||
             v.description.toLowerCase().includes(query)
      )
      dispatch(setFilteredVideos(results))
    } else {
      dispatch(setFilteredVideos([]))
    }
  }, [searchQuery, dispatch, videos])

  return (
    <Layout>
      <div className="search-page">
        <div className="search-header">
          <h1>Search results for "{searchQuery}"</h1>
          <p>{filteredVideos.length} results found</p>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="search-results">
            {filteredVideos.map((video) => (
              <div key={video.id} className="search-result-item">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <p>No videos found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="empty-search">
            <p>Enter a search term to find videos</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
