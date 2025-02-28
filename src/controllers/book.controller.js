import { BookRepository } from "../repositories/index.js"
import { BooksCollection, BookResource } from "../resources/index.js";

export const index = async (req,res)=>{
    const { query } = req;

    const books = await BookRepository.fetchAll(query);
    
    const booksCollection = BooksCollection(books, query)

    res.json(booksCollection);
}


export const show = async (req,res)=>{
    const { id } = req.params;

    const book = await BookRepository.fetchOne(id);

    const bookResource = BookResource(book)

    res.json(bookResource);
}


export const store = async (req,res)=>{
    const book = await BookRepository.create(req.body);

    const bookResource = BookResource(book)

    res.status(201).json(bookResource);
}


export const update = async (req,res)=>{
    const { id } = req.params

    const book = await BookRepository.update(id, req.body);

    const bookResource = BookResource(book)

    res.status(201).json(bookResource);
}


export const remove = async (req,res)=>{
    const { id } = req.params

    const book = await BookRepository.remove(id)
    
    const bookResource = BookResource(book)

    res.json(bookResource);
}