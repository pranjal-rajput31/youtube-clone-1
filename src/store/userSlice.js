import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService, userService } from '../utils/apiService'

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password)
      return data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email, password)
      return data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe()
      return data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const subscribeChannelAsync = createAsyncThunk(
  'user/subscribe',
  async (channelId, { rejectWithValue }) => {
    try {
      const data = await userService.subscribeChannel(channelId)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to subscribe')
    }
  }
)

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  subscribedChannels: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = !!action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isLoggedIn = false
      state.subscribedChannels = []
      authService.logout()
    },
    addSubscription: (state, action) => {
      if (!state.subscribedChannels.includes(action.payload)) {
        state.subscribedChannels.push(action.payload)
      }
    },
    removeSubscription: (state, action) => {
      state.subscribedChannels = state.subscribedChannels.filter(
        ch => ch !== action.payload
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isLoggedIn = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isLoggedIn = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isLoggedIn = true
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false
        state.isLoggedIn = false
      })
  },
})

export const {
  setUser,
  setLoading,
  setError,
  logout,
  addSubscription,
  removeSubscription,
} = userSlice.actions

export default userSlice.reducer
