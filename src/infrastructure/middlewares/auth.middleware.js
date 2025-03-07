import jwt from 'jsonwebtoken'
import config from '../../config/config.js'
import User from '../../models/user.model.js'

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' })
        }

        const decodedPayload = jwt.verify(token, config.jwt.secret)

        const user = await User.findOne({
            _id: decodedPayload.id,
        })

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.error(error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        return res.status(500).json({ message: 'Authentication error' })
    }
}

export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res
                .status(403)
                .json({ message: 'Unauthorized: No role assigned' })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: 'Unauthorized: Insufficient role' })
        }
        next()
    }
}
