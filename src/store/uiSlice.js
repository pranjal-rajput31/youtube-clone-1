import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  darkMode: false,
  searchQuery: '',
  notificationsCount: 0,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setNotificationsCount: (state, action) => {
      state.notificationsCount = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setSearchQuery,
  setNotificationsCount,
} = uiSlice.actions

export default uiSlice.reducer
