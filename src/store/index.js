import { configureStore } from '@reduxjs/toolkit'
import videoReducer from './videoSlice'
import userReducer from './userSlice'
import uiReducer from './uiSlice'

const store = configureStore({
  reducer: {
    videos: videoReducer,
    user: userReducer,
    ui: uiReducer,
  },
})

export default store
