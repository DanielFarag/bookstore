
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
        require: true
    },
    description: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    }
})

bookSchema.virtual('fullPath').get(function() {
    return `/uploads/${this.image}`;
});

export default new model("Book", bookSchema)
