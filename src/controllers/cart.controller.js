import User from '../models/user.model.js'
import Book from '../models/book.js'
import { io } from "../../bin/www.js"; 

// Get Cart
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            'cart.items.bookId',
            'title author price imageUrl'
        )
        res.status(200).json(user.cart)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error })
    }
}

// Add Item to Cart
export const addItemToCart = async (req, res) => {
    const { bookId, quantity = 1 } = req.body

    try {
        const book = await Book.findById(bookId)
        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        // Check if the requested quantity exceeds the available stock
        if (quantity > book.stock) {
            return res.status(400).json({
                message: `Requested quantity (${quantity}) exceeds available stock (${book.stock})`,
            })
        }

        const user = req.user
        const cartItem = user.cart.items.find(
            (item) => item.bookId.toString() === bookId
        )

        // Calculate the total quantity if the item already exists in the cart
        const newQuantity = cartItem ? cartItem.quantity + quantity : quantity

        // Check if the new total quantity exceeds the available stock
        if (newQuantity > book.stock) {
            return res.status(400).json({
                message: `Total quantity (${newQuantity}) exceeds available stock (${book.stock})`,
            })
        }

        if (cartItem) {
            cartItem.quantity += quantity
        } else {
            user.cart.items.push({ bookId, quantity, price: book.price })
        }

        user.cart.totalItems += quantity
        user.cart.totalPrice += book.price * quantity

        await user.save()

        io.emit("cartAdded");
        
        res.status(200).json({
            message: 'Book added to cart successfully',
            cart: user.cart,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error })
    }
}

// Update Cart Item Quantity
export const updateCartItemQuantity = async (req, res) => {
    const { bookId } = req.params
    const { quantity } = req.body

    try {
        const book = await Book.findById(bookId)
        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        const user = req.user
        const cartItem = user.cart.items.find(
            (item) => item.bookId.toString() === bookId
        )

        if (!cartItem) {
            return res.status(404).json({ message: 'Book not in cart' })
        }

        // Check if the new quantity exceeds the available stock
        if (quantity > book.stock) {
            return res.status(400).json({
                message: `Requested quantity (${quantity}) exceeds available stock (${book.stock})`,
            })
        }

        const oldQuantity = cartItem.quantity
        cartItem.quantity = quantity

        user.cart.totalItems += quantity - oldQuantity
        user.cart.totalPrice += cartItem.price * (quantity - oldQuantity)

        await user.save()

        io.emit("cartQuantityUpdated");

        res.status(200).json({
            message: 'Cart item quantity updated successfully',
            cart: user.cart,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error updating cart item quantity',
            error,
        })
    }
}
// Remove Item from Cart
export const removeItemFromCart = async (req, res) => {
    const { bookId } = req.params

    try {
        const user = req.user
        const cartItemIndex = user.cart.items.findIndex(
            (item) => item.bookId.toString() === bookId
        )

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Book not in cart' })
        }

        const cartItem = user.cart.items[cartItemIndex]
        user.cart.totalItems -= cartItem.quantity
        user.cart.totalPrice -= cartItem.price * cartItem.quantity

        user.cart.items.splice(cartItemIndex, 1)
        await user.save()
        res.status(200).json({
            message: 'Book removed from cart successfully',
            cart: user.cart,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error removing item from cart',
            error,
        })
    }
}

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const user = req.user
        user.cart.items = []
        user.cart.totalItems = 0
        user.cart.totalPrice = 0

        await user.save()
        res.status(200).json({
            message: 'Cart cleared successfully',
            cart: user.cart,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error })
    }
}
