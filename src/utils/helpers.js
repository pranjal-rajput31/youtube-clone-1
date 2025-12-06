// Convert seconds to MM:SS format
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  
  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Convert MM:SS format to seconds
export const parseDuration = (durationString) => {
  if (!durationString) return 0
  
  const parts = durationString.split(':')
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10)
    const seconds = parseInt(parts[1], 10)
    return minutes * 60 + seconds
  }
  
  return 0
}
