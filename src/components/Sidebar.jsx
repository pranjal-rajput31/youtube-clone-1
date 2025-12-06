import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../store/uiSlice'
import '../styles/Sidebar.css'

export default function Sidebar() {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => dispatch(toggleSidebar())}
        title="Toggle sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
              </svg>
              <span>Home</span>
            </Link>
            <Link to="/trending" className={`sidebar-link ${isActive('/trending') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 8 13.41l4 4 6.3-6.29L22 12v-6z"></path>
              </svg>
              <span>Trending</span>
            </Link>
            <Link to="/subscriptions" className={`sidebar-link ${isActive('/subscriptions') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8H4V6h16m0 10H4v-2h16m0 6H4v-2h16"></path>
              </svg>
              <span>Subscriptions</span>
            </Link>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Your Library</h3>
            <Link to="/library/history" className={`sidebar-link ${isActive('/library/history') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.52.46-.78-3.74-2.2V8z"></path>
              </svg>
              <span>History</span>
            </Link>
            <Link to="/library/liked" className={`sidebar-link ${isActive('/library/liked') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
              <span>Liked videos</span>
            </Link>
            <Link to="/uploads" className={`sidebar-link ${isActive('/uploads') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              <span>Your videos</span>
            </Link>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Explore</h3>
            <Link to="/trending" className="sidebar-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
              </svg>
              <span>Trending</span>
            </Link>
            <Link to="/music" className="sidebar-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v9.28c-.47-.46-1.12-.72-1.84-.72-2.49 0-4.5 2.01-4.5 4.5S7.51 21 12 21s4.5-2.01 4.5-4.5V7h4V3h-7z"></path>
              </svg>
              <span>Music</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
