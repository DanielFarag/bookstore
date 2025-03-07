import { BooksCollection, BookResource } from '../resources/index.js'
import { Book } from '../models/index.js'
import { throwIfNotFound } from '../infrastructure/helpers/index.js'
import { mailer } from '../infrastructure/services/index.js'

export const index = async (req, res) => {
    let {
        page = 1,
        perPage = 10,
        title,
        author,
        description,
        minStock,
        maxStock,
    } = req.query

    page = parseInt(page) - 1
    perPage = parseInt(perPage)

    const filter = {}

    if (title) filter.title = new RegExp(title, 'i')
    if (author) filter.author = new RegExp(author, 'i')
    if (description) filter.description = new RegExp(description, 'i')
    if (minStock || maxStock) {
        filter.stock = {}
        if (minStock) filter.stock.$gte = parseInt(minStock)
        if (maxStock) filter.stock.$lte = parseInt(maxStock)
    }

    const books = await Book.find(filter)
        .skip(page * perPage)
        .limit(perPage)

    const booksCollection = BooksCollection(books, req.query)

    res.json(booksCollection)
}

export const show = async (req, res) => {
    const { id } = req.params

    const book = await Book.findOne({ _id: id })

    throwIfNotFound(book)

    const bookResource = BookResource(book)

    res.json(bookResource)
}

export const store = async (req, res) => {
    if (!req.file) throw new Error('image_not_defined')

    const { title, author, price, description, stock } = req.body

    const book = await Book.insertOne({
        title,
        author,
        price,
        description,
        stock,
        image: req.file.filename,
    })

    const bookResource = BookResource(book)

    mailer.notifyAllUsers(book)

    res.status(201).json(bookResource)
}

export const update = async (req, res) => {
    const { id } = req.params

    const { title, author, price, description, stock } = req.body

    const book = await Book.findByIdAndUpdate(
        { _id: id },
        {
            title,
            author,
            price,
            description,
            stock,
            image: req.file?.filename,
        },
        { new: true }
    )

    throwIfNotFound(book)

    const bookResource = BookResource(book)

    res.status(201).json(bookResource)
}

export const remove = async (req, res) => {
    const { id } = req.params

    const book = await Book.findByIdAndDelete({ _id: id })

    throwIfNotFound(book)

    const bookResource = BookResource(book)

    res.json(bookResource)
}
