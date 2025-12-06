import express from 'express'
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
} from '../controllers/commentController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/video/:videoId', getComments)
router.post('/', protect, createComment)
router.put('/:id', protect, updateComment)
router.delete('/:id', protect, deleteComment)
router.put('/:id/like', protect, likeComment)

export default router
