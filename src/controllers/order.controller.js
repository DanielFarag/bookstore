import { throwIfNotFound } from '../infrastructure/helpers/index.js'
import Order from '../models/order.js'
import Book from '../models/book.js'
import { OrdersCollection, OrderResource } from '../resources/index.js'
import { io } from "../../bin/www.js"; 
import { mailer } from "../infrastructure/services/index.js";

export const createOrder = async (req, res) => {
    try {
        const user = req.user

        if (user.cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' })
        }

        for (const item of user.cart.items) {
            const book = await Book.findById(item.bookId)
            if (!book) {
                return res
                    .status(404)
                    .json({ message: `Book not found: ${item.bookId}` })
            }

            if (book.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for book: ${book.title}. Available: ${book.stock}, Requested: ${item.quantity}`,
                })
            }
        }

        const items = user.cart.items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
        }))
        const totalPrice = user.cart.totalPrice

        const order = new Order({
            userId: user._id,
            items,
            totalPrice,
        })
        await order.save()

        const stockUpdatePromises = user.cart.items.map((item) =>
            Book.findByIdAndUpdate(item.bookId, {
                $inc: { stock: -item.quantity },
            })
        )
        await Promise.all(stockUpdatePromises)

        user.cart.items = []
        user.cart.totalItems = 0
        user.cart.totalPrice = 0
        await user.save()

        mailer.new_order(order)

        res.status(201).json({
            message: 'Order placed successfully',
            orderId: order._id,
        })
    } catch (error) {
        console.error('Error creating order:', error)
        res.status(500).json({
            message: 'Error creating order',
            error: error.message,
        })
    }
}
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate(
            'items.bookId',
            'title author price imageUrl'
        )

        throwIfNotFound(order)

        if (
            req.user.role !== 'admin' &&
            order.userId.toString() !== req.user.id.toString()
        ) {
            return res.status(403).json({
                message: 'Forbidden: You do not have access to this order',
            })
        }

        res.status(200).json(OrderResource(order))
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error })
    }
}

export const listUserOrder = async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('items.bookId', 'title author price imageUrl')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const count = await Order.countDocuments({ userId: req.user.id })

        res.status(200).json({
            data: OrdersCollection(orders, req.query),
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalOrders: count,
                totalPages: Math.ceil(count / limit),
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error fetching order history', error })
    }
}

export const listAllOrders = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        userId,
        orderDateFrom,
        orderDateTo,
    } = req.query

    try {
        const query = {}
        if (status) query.status = status
        if (userId) query.userId = userId
        if (orderDateFrom && orderDateTo) {
            query.orderDate = {
                $gte: new Date(orderDateFrom),
                $lte: new Date(orderDateTo),
            }
        }

        const orders = await Order.find(query)
            .populate('items.bookId', 'title author price imageUrl')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const count = await Order.countDocuments(query)

        res.status(200).json({
            data: OrdersCollection(orders, req.query),
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalOrders: count,
                totalPages: Math.ceil(count / limit),
            },
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error })
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body

    try {
        const order = await Order.findById(orderId)

        throwIfNotFound(order)

        order.status = status
        await order.save()

        io.emit("orderStatusChanged");

        mailer.order_updated(order)

        res.status(200).json({
            message: 'Order status updated successfully',
            order,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error })
    }
}
