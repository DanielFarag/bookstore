export const BookResource = (book)=>{
    return {
        id: book._id,
        title:book.title,
        author:book.author,
        price:book.price,
        description:book.description,
        stock:book.stock,
        image:book.fullPath,
    }
}

export const BooksCollection = (books, query)=>{
    return {
        data: books.map(BookResource),
        query
    }
}
