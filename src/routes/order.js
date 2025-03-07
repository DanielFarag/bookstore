import { Router } from 'express'
import { OrderController } from '../controllers/index.js'
import {
    authenticate,
    authorizeRole,
} from '../infrastructure/middlewares/auth.middleware.js'
import asyncHandler from '../infrastructure/helpers/async-handler.js'

const router = Router()

// Apply authentication middleware to all order routes
router.use(authenticate)

// Create order (checkout)
router.post('/', asyncHandler(OrderController.createOrder))

// List authenticated user's order history
router.get('/me', asyncHandler(OrderController.listUserOrder))

// Get order by ID (user can access their own order, admin can access any order)
router.get('/:orderId', asyncHandler(OrderController.getOrderById))

// Admin-only routes
router.use(authorizeRole('admin'))

// List all orders (admin only)
router.get('/', asyncHandler(OrderController.listAllOrders))

// Update order status (admin only)
router.patch(
    '/:orderId/status',
    asyncHandler(OrderController.updateOrderStatus)
)

export default router
