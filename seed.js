import { faker } from '@faker-js/faker';
import { Book } from "./models/index.js"

import { connectDB }  from './infrastructure/services/index.js';
import { disconnect } from 'mongoose';


await connectDB()
await Book.deleteMany({})
for (let index = 0; index < 200; index++) {
  const book = new Book({
    title: faker.word.words(3),
    author: faker.person.firstName(),
    price: faker.commerce.price(),
    description: faker.lorem.sentence(),
    stock: faker.number.int({ min: 1, max: 100 }),
    image: faker.image.url()
  })
  await book.save()
}

disconnect()