import express from 'express'
import {
  getUserProfile,
  searchUsers,
  subscribeChannel,
  getSubscriptions,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/search', searchUsers)
router.get('/:id', getUserProfile)
router.put('/:id/subscribe', protect, subscribeChannel)
router.get('/subscriptions', protect, getSubscriptions)

export default router
