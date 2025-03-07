import { Router } from 'express'
import { CartController } from '../controllers/index.js'
import { authenticate } from '../infrastructure/middlewares/auth.middleware.js'

const router = Router()

// Apply authentication middleware to all cart routes
router.use(authenticate)

// Get cart
router.get('/', CartController.getCart)

// Add item to cart
router.post('/items', CartController.addItemToCart)

// Update cart item quantity
router.put('/items/:bookId', CartController.updateCartItemQuantity)
router.patch('/items/:bookId', CartController.updateCartItemQuantity)

// Remove item from cart
router.delete('/items/:bookId', CartController.removeItemFromCart)

// Clear cart
router.delete('/', CartController.clearCart)

export default router
