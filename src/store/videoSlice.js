import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { videoService } from '../utils/apiService'

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async ({ page = 1, search = '', category = '' }, { rejectWithValue }) => {
    try {
      const data = await videoService.getVideos(page, 20, search, category)
      return data.videos
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos')
    }
  }
)

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await videoService.getVideoById(id)
      return data.video
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video')
    }
  }
)

export const likeVideoAsync = createAsyncThunk(
  'videos/likeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const data = await videoService.likeVideo(id)
      return data.video
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like video')
    }
  }
)

export const dislikeVideoAsync = createAsyncThunk(
  'videos/dislikeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const data = await videoService.dislikeVideo(id)
      return data.video
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dislike video')
    }
  }
)

const initialState = {
  videos: [],
  filteredVideos: [],
  selectedVideo: null,
  loading: false,
  error: null,
}

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload
    },
    setFilteredVideos: (state, action) => {
      state.filteredVideos = action.payload
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedVideo = action.payload
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(likeVideoAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(likeVideoAsync.fulfilled, (state, action) => {
        state.loading = false
        state.selectedVideo = action.payload
      })
      .addCase(likeVideoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(dislikeVideoAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(dislikeVideoAsync.fulfilled, (state, action) => {
        state.loading = false
        state.selectedVideo = action.payload
      })
      .addCase(dislikeVideoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setVideos,
  setFilteredVideos,
  setSelectedVideo,
  setLoading,
  setError,
} = videoSlice.actions

export default videoSlice.reducer
