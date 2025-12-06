import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===== AUTH ENDPOINTS =====
export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      passwordConfirm: password,
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ===== VIDEO ENDPOINTS =====
export const videoService = {
  getVideos: async (page = 1, limit = 20, search = '', category = '') => {
    const response = await api.get('/videos', {
      params: { page, limit, search, category },
    })
    return response.data
  },

  getUserVideos: async (userId) => {
    const response = await api.get(`/videos/user/${userId}`)
    return response.data
  },

  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`)
    return response.data
  },

  createVideo: async (videoData) => {
    const response = await api.post('/videos', videoData)
    return response.data
  },

  updateVideo: async (id, videoData) => {
    const response = await api.put(`/videos/${id}`, videoData)
    return response.data
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`)
    return response.data
  },

  likeVideo: async (id) => {
    const response = await api.put(`/videos/${id}/like`)
    return response.data
  },

  dislikeVideo: async (id) => {
    const response = await api.put(`/videos/${id}/dislike`)
    return response.data
  },
}

// ===== COMMENT ENDPOINTS =====
export const commentService = {
  getComments: async (videoId) => {
    const response = await api.get(`/comments/video/${videoId}`)
    return response.data
  },

  createComment: async (text, videoId, parentCommentId = null) => {
    const response = await api.post('/comments', {
      text,
      videoId,
      parentCommentId,
    })
    return response.data
  },

  updateComment: async (id, text) => {
    const response = await api.put(`/comments/${id}`, { text })
    return response.data
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`)
    return response.data
  },

  likeComment: async (id) => {
    const response = await api.put(`/comments/${id}/like`)
    return response.data
  },
}

// ===== USER ENDPOINTS =====
export const userService = {
  getUserProfile: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  searchUsers: async (query, limit = 10) => {
    const response = await api.get('/users/search', {
      params: { query, limit },
    })
    return response.data
  },

  subscribeChannel: async (id) => {
    const response = await api.put(`/users/${id}/subscribe`)
    return response.data
  },

  getSubscriptions: async () => {
    const response = await api.get('/users/subscriptions')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },
}

// ===== CHANNEL ENDPOINTS =====
export const channelService = {
  createChannel: async (data) => {
    const response = await api.post('/channels', data)
    return response.data
  },

  getUserChannel: async (userId) => {
    const response = await api.get(`/channels/user/${userId}`)
    return response.data
  },

  getChannel: async (id) => {
    const response = await api.get(`/channels/${id}`)
    return response.data
  },

  updateChannel: async (id, data) => {
    const response = await api.put(`/channels/${id}`, data)
    return response.data
  },

  subscribeChannel: async (id) => {
    const response = await api.put(`/channels/${id}/subscribe`)
    return response.data
  },
}

// Export as single object
export const apiService = {
  authService,
  videoService,
  commentService,
  userService,
  channelService,
}
