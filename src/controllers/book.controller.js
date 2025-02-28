import { BooksCollection, BookResource } from "../resources/index.js";
import { Book } from "../models/index.js"
import { throwIfNotFound } from "../infrastructure/helpers/index.js";


export const index = async (req,res)=>{
    let { page, perPage } = req.query;

    page = page ?? 1
    perPage = perPage ?? 10
    
    const books = await Book.find().skip((page-1) * perPage).limit(perPage)

    const booksCollection = BooksCollection(books, req.query)

    res.json(booksCollection);
}


export const show = async (req,res)=>{
    const { id } = req.params;

    const book = await Book.findOne({ _id: id})

    throwIfNotFound(book);

    const bookResource = BookResource(book)

    res.json(bookResource);
}


export const store = async (req,res)=>{
    const {
        title,
        author,
        price,
        description,
        stock,
        image,
    } = req.body

    const book = await Book.insertOne({
        title,
        author,
        price,
        description,
        stock,
        image,
    })

    const bookResource = BookResource(book)

    res.status(201).json(bookResource);
}


export const update = async (req,res)=>{
    const { id } = req.params

    const {
        title,
        author,
        price,
        description,
        stock,
        image,
    } = req.body


    const book = await Book.findByIdAndUpdate({_id: id}, {
        title,
        author,
        price,
        description,
        stock,
        image,
    }, {new: true })

    
    throwIfNotFound(book);

    const bookResource = BookResource(book)

    res.status(201).json(bookResource);
}


export const remove = async (req,res)=>{
    const { id } = req.params

    const book = await Book.findByIdAndDelete({_id: id});
    
    throwIfNotFound(book);

    const bookResource = BookResource(book)

    res.json(bookResource);
}