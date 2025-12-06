import User from '../models/User.js'

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('videos')
      .populate('subscribedTo', 'name avatar')
      .select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search users
// @route   GET /api/users/search/:query
// @access  Public
export const searchUsers = async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.query

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Subscribe to channel
// @route   PUT /api/users/:id/subscribe
// @access  Private
export const subscribeChannel = async (req, res, next) => {
  try {
    const channelId = req.params.id
    const userId = req.user.id

    // Can't subscribe to yourself
    if (channelId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot subscribe to yourself',
      })
    }

    const user = await User.findById(userId)
    const channel = await User.findById(channelId)

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      })
    }

    // Check if already subscribed
    if (user.subscribedTo.includes(channelId)) {
      // Unsubscribe
      user.subscribedTo = user.subscribedTo.filter(id => id.toString() !== channelId)
      channel.subscribers = Math.max(0, channel.subscribers - 1)
    } else {
      // Subscribe
      user.subscribedTo.push(channelId)
      channel.subscribers += 1
    }

    await user.save()
    await channel.save()

    res.status(200).json({
      success: true,
      message: user.subscribedTo.includes(channelId) ? 'Subscribed' : 'Unsubscribed',
      user,
      channel,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's subscribed channels
// @route   GET /api/users/subscriptions
// @access  Private
export const getSubscriptions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedTo')

    res.status(200).json({
      success: true,
      count: user.subscribedTo.length,
      subscriptions: user.subscribedTo,
    })
  } catch (error) {
    next(error)
  }
}
