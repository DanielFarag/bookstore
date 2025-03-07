import { Schema, model } from 'mongoose'

const orderItemSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
})

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    items: [orderItemSchema],
})

export default new model('Order', orderSchema)
