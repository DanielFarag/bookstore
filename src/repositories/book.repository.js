import { throwIfNotFound } from "../infrastructure/helpers/index.js";
import { Book } from "../models/index.js"

export const fetchAll = (query)=>{
    let { page, perPage } = query;

    page = page ?? 1
    perPage = perPage ?? 10
    
    return Book.find().skip((page-1) * perPage).limit(perPage)
}

export const fetchOne = async (id)=>{
    const book = await Book.findOne({ _id: id})

    return throwIfNotFound(book);
}

export const create = (data)=>{
    const {
        title,
        author,
        price,
        description,
        stock,
        image,
    } = data

    return Book.insertOne({
        title,
        author,
        price,
        description,
        stock,
        image,
    })
}

export const update = async (id, data)=>{
    const {
        title,
        author,
        price,
        description,
        stock,
        image,
    } = data


    const book = await Book.findByIdAndUpdate({_id: id}, {
        title,
        author,
        price,
        description,
        stock,
        image,
    }, {new: true })

    return throwIfNotFound(book);
}

export const remove = async (id) => {
    const book = await Book.findByIdAndDelete({_id: id});

    return throwIfNotFound(book);
}