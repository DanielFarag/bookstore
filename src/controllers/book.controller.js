import { BooksCollection, BookResource } from "../resources/index.js";
import { Book } from "../models/index.js";
import { throwIfNotFound } from "../infrastructure/helpers/index.js";
import { redisClient } from "../config/redisClient.js";

export const index = async (req, res) => {
  let { page, perPage } = req.query;

  page = page ?? 1;
  perPage = perPage ?? 10;

  const cacheKey = `books:list:page:${page}:perPage:${perPage}`;

  try {
    const cachedBooks = await redisClient.get(cacheKey);
    if (cachedBooks) {
      console.log("Cache hit for book list (index)");
      return res.json(JSON.parse(cachedBooks));
    }

    console.log("Cache miss for book list (index), fetching from DB");
    const books = await Book.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    const booksCollection = BooksCollection(books, req.query);

    const booksCollectionToCache = JSON.stringify(booksCollection);
    await redisClient.set(cacheKey, booksCollectionToCache, { EX: 120 });
    console.log("Book list (index) cached in Redis");

    return res.json(booksCollection);
  } catch (error) {
    console.error("Error in index endpoint:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `book:details:${id}`;

  try {
    const cachedBook = await redisClient.get(cacheKey);
    if (cachedBook) {
      console.log("Cache hit for book details (show)");
      return res.json(JSON.parse(cachedBook));
    }

    console.log("Cache miss for book details (show), fetching from DB");
    const book = await Book.findOne({ _id: id });
    throwIfNotFound(book);
    const bookResource = BookResource(book);

    const bookResourceToCache = JSON.stringify(bookResource);
    await redisClient.set(cacheKey, bookResourceToCache, { EX: 3600 });
    console.log("Book details (show) cached in Redis");

    return res.json(bookResource);
  } catch (error) {
    console.error("Error in show endpoint:", error);
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch book details", error: error.message });
  }
};

export const store = async (req, res) => {
  const { title, author, price, description, stock, image } = req.body;

  const book = await Book.insertOne({
    title,
    author,
    price,
    description,
    stock,
    image,
  });

  const bookResource = BookResource(book);

  res.status(201).json(bookResource);
};

export const update = async (req, res) => {
  const { id } = req.params;

  const { title, author, price, description, stock, image } = req.body;

  const book = await Book.findByIdAndUpdate(
    { _id: id },
    {
      title,
      author,
      price,
      description,
      stock,
      image,
    },
    { new: true }
  );

  throwIfNotFound(book);

  const bookResource = BookResource(book);

  res.status(201).json(bookResource);
};

export const remove = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findByIdAndDelete({ _id: id });

  throwIfNotFound(book);

  const bookResource = BookResource(book);

  res.json(bookResource);
};
