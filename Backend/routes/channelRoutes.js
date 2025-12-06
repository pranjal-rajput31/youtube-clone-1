import express from 'express'
import {
  createChannel,
  getUserChannel,
  getChannel,
  updateChannel,
  subscribeChannel,
} from '../controllers/channelController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createChannel)
router.get('/user/:userId', getUserChannel)
router.get('/:id', getChannel)
router.put('/:id', protect, updateChannel)
router.put('/:id/subscribe', protect, subscribeChannel)

export default router
