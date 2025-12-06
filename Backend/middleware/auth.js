import { verifyToken } from '../config/jwt.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token

    console.log('\n=== AUTH MIDDLEWARE ===')
    console.log('Authorization header:', req.headers.authorization)
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
      console.log('Token extracted:', token ? 'YES (length: ' + token.length + ')' : 'NO')
    }

    if (!token) {
      console.log('No token found - returning 401')
      console.log('=== END AUTH MIDDLEWARE ===\n')
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      })
    }

    const decoded = verifyToken(token)
    console.log('Token decoded:', decoded ? 'YES' : 'NO')
    console.log('Decoded data:', decoded)

    if (!decoded) {
      console.log('Invalid token - returning 401')
      console.log('=== END AUTH MIDDLEWARE ===\n')
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      })
    }

    req.user = await User.findById(decoded.userId)
    console.log('User found:', req.user ? 'YES (ID: ' + req.user._id + ')' : 'NO')

    if (!req.user) {
      console.log('User not found - returning 404')
      console.log('=== END AUTH MIDDLEWARE ===\n')
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    console.log('Auth successful - calling next()')
    console.log('=== END AUTH MIDDLEWARE ===\n')
    next()
  } catch (error) {
    console.log('\n=== AUTH ERROR ===')
    console.log('Error:', error.message)
    console.log('=== END AUTH ERROR ===\n')
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      })
    }
    next()
  }
}
