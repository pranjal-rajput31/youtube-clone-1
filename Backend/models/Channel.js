import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, 'Please provide a channel name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Channel name cannot be more than 100 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    channelBanner: {
      type: String,
      default: null,
    },
    channelAvatar: {
      type: String,
      default: null,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Channel = mongoose.model('Channel', channelSchema)
export default Channel
