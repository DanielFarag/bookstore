import { BooksCollection, BookResource } from "../resources/index.js";
import { Book } from "../models/index.js";
import { throwIfNotFound } from "../infrastructure/helpers/index.js";
import { redisClient } from "../config/redisClient.js";
import { mailer } from "../infrastructure/services/index.js";

export const index = async (req, res) => {
  let {
    page = 1,
    perPage = 10,
    title,
    author,
    description,
    from_stock,
    to_stock,
    from_price,
    to_price,
  } = req.query


  const queryParams = {
    title,
    author,
    description,
    from_stock,
    to_stock,
    from_price,
    to_price,
  };

  const filteredParams = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}:${value}`)
    .join(':');

  const cacheKey = `books:list:page:${page}:perPage:${perPage}${filteredParams ? ':' + filteredParams : ''}`;

  const cachedBooks = await redisClient.get(cacheKey);

  if (cachedBooks) {
    console.log("Cache hit for book list (index)");
    return res.json(JSON.parse(cachedBooks));
  }

  page = parseInt(page) - 1
  perPage = parseInt(perPage)

  const filter = { deletedAt: null };
  if (title) filter.title = new RegExp(title, 'i')
  if (author) filter.author = new RegExp(author, 'i')
  if (description) filter.description = new RegExp(description, 'i')
    if (from_stock || to_stock) {
      filter.stock = {}
      if (from_stock) filter.stock.$gte = parseInt(from_stock)
      if (to_stock) filter.stock.$lte = parseInt(to_stock)
  }
  if (from_price || to_price) {
    filter.price = {}
    if (from_price) filter.price.$gte = parseInt(from_price)
    if (to_price) filter.price.$lte = parseInt(to_price)
  }

  const books = await Book.find(filter)
    .skip(page * perPage)
    .limit(perPage)


  req.query.total = await Book.countDocuments(filter)
    
  const booksCollection = BooksCollection(books, req.query);

  const booksCollectionToCache = JSON.stringify(booksCollection);
  await redisClient.set(cacheKey, booksCollectionToCache, { EX: 120 });
  console.log("Book list (index) cached in Redis");

  return res.json(booksCollection);
};

export const show = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `book:details:${id}`;

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
};

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

  const listCachePattern = `books:list:*`;
  const keys = await redisClient.keys(listCachePattern);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }


  res.status(201).json(bookResource)
    
};

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


  const cacheKey = `book:details:${id}`;
  await redisClient.del(cacheKey);
  
  const listCachePattern = `books:list:*`;
  const keys = await redisClient.keys(listCachePattern);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }


  res.status(201).json(bookResource)
};

export const remove = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findByIdAndUpdate(
      { _id: id },
      { deletedAt: new Date() }
  );

  throwIfNotFound(book);

  const bookResource = BookResource(book);

  const cacheKey = `book:details:${id}`;
  await redisClient.del(cacheKey);
  
  const listCachePattern = `books:list:*`;
  const keys = await redisClient.keys(listCachePattern);
  if (keys.length > 0) {
      await redisClient.del(...keys);
  }

  res.json(bookResource);
};
