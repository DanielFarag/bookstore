export const BookResource = (book)=>{
    return {
        id: book._id,
        title: book.title
    }
}

export const BooksCollection = (books, query)=>{
    return {
        data: books.map(BookResource),
        page: query.page ? Number(query.page) : 1,
        perPage: query.perPage ? Number(query.perPage) : 10,
    }
}
