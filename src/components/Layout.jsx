import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../store/uiSlice'
import Header from './Header'
import Sidebar from './Sidebar'
import '../styles/Layout.css'

export default function Layout({ children }) {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div className="app-layout">
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="main-container">
        <Sidebar />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
