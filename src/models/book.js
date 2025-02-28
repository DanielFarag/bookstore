
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

export default new model("Book", bookSchema)
