import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '../store/uiSlice'
import { toggleSidebar } from '../store/uiSlice'
import { logout } from '../store/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchQuery = useSelector(state => state.ui.searchQuery)
  const user = useSelector(state => state.user.user)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    navigate('/')
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-btn"
          onClick={handleToggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Link to="/" className="logo">
          <svg viewBox="0 0 90 20" className="logo-icon">
            <text x="0" y="15" fontSize="16" fontWeight="bold" fill="#FF0000">
              ▶ YouTube
            </text>
          </svg>
        </Link>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button type="submit" className="search-btn" onClick={handleSearchButtonClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>
      </div>

      <div className="header-right">
        {user ? (
          <>
            <button className="icon-btn" title="Apps">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="4" height="4"></rect>
                <rect x="10" y="3" width="4" height="4"></rect>
                <rect x="17" y="3" width="4" height="4"></rect>
                <rect x="3" y="10" width="4" height="4"></rect>
                <rect x="10" y="10" width="4" height="4"></rect>
                <rect x="17" y="10" width="4" height="4"></rect>
                <rect x="3" y="17" width="4" height="4"></rect>
                <rect x="10" y="17" width="4" height="4"></rect>
                <rect x="17" y="17" width="4" height="4"></rect>
              </svg>
            </button>
            <button className="icon-btn" title="Notifications">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <div className="user-menu-wrapper">
              <button
                className="user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={user.name}
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <Link to="/uploads" className="dropdown-item">
                    My Videos
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">
              Sign In
            </Link>
            <Link to="/register" className="btn-register">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
