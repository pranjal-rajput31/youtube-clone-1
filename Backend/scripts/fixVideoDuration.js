import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Video from '../models/Video.js'

async function fixVideoDuration() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    const videos = await Video.find({})
    console.log(`Found ${videos.length} videos`)

    for (let video of videos) {
      let newDuration = 0

      if (typeof video.duration === 'string') {
        // Convert "12:34" to 754 seconds
        const parts = video.duration.split(':')
        if (parts.length === 2) {
          const minutes = parseInt(parts[0])
          const seconds = parseInt(parts[1])
          newDuration = minutes * 60 + seconds
        }
      } else if (typeof video.duration === 'number') {
        newDuration = video.duration
      }

      video.duration = newDuration
      await video.save()
      console.log(`Fixed video ${video._id}: duration = ${newDuration} seconds`)
    }

    console.log('✓ All videos fixed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixVideoDuration()
