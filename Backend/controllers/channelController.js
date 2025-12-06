import Channel from '../models/Channel.js'
import User from '../models/User.js'

// @desc    Create channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res, next) => {
  try {
    const { channelName, description } = req.body

    if (!channelName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a channel name',
      })
    }

    // Check if channel already exists for this user
    const existingChannel = await Channel.findOne({ owner: req.user.id })
    if (existingChannel) {
      return res.status(400).json({
        success: false,
        message: 'User already has a channel',
      })
    }

    const channel = await Channel.create({
      channelName,
      owner: req.user.id,
      description: description || '',
    })

    // Add channel to user
    await User.findByIdAndUpdate(req.user.id, {
      channel: channel._id,
    })

    res.status(201).json({
      success: true,
      channel,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's channel
// @route   GET /api/channels/user/:userId
// @access  Public
export const getUserChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({ owner: req.params.userId })
      .populate('owner', 'name email avatar')
      .populate('videos')

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      })
    }

    res.status(200).json({
      success: true,
      channel,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Public
export const getChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('videos')

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      })
    }

    res.status(200).json({
      success: true,
      channel,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
export const updateChannel = async (req, res, next) => {
  try {
    let channel = await Channel.findById(req.params.id)

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      })
    }

    // Check ownership
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this channel',
      })
    }

    channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      channel,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Subscribe to channel
// @route   PUT /api/channels/:id/subscribe
// @access  Private
export const subscribeChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      })
    }

    // Check if already subscribed
    if (channel.subscribedBy.includes(req.user.id)) {
      // Unsubscribe
      channel.subscribedBy = channel.subscribedBy.filter(
        id => id.toString() !== req.user.id
      )
      channel.subscribers = channel.subscribedBy.length
    } else {
      // Subscribe
      channel.subscribedBy.push(req.user.id)
      channel.subscribers = channel.subscribedBy.length
    }

    await channel.save()

    res.status(200).json({
      success: true,
      channel,
    })
  } catch (error) {
    next(error)
  }
}
