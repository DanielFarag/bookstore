
import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true,
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true,
        min: [0, 'Stock must be a positive number'],
    },
    image: {
        type: String,
        require: true
    },
    deletedAt: { type: Date, default: null },
})

bookSchema.virtual('fullPath').get(function() {
    return `/uploads/${this.image}`;
});

export default new model("Book", bookSchema)
