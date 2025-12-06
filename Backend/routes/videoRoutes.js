import express from 'express'
import {
  getVideos,
  getVideo,
  getUserVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from '../controllers/videoController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getVideos)
router.get('/user/:userId', getUserVideos)
router.put('/:id/like', protect, likeVideo)
router.put('/:id/dislike', protect, dislikeVideo)
router.get('/:id', getVideo)
router.post('/', protect, createVideo)
router.put('/:id', protect, updateVideo)
router.delete('/:id', protect, deleteVideo)

export default router
