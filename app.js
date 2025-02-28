import express, { json, urlencoded } from 'express';
import { join, dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from "swagger-ui-express";


import { connectDB, swaggerDocs }  from './src/infrastructure/services/index.js';
import { NotFound, Validation, UserIs }  from './src/infrastructure/middlewares/index.js';


import indexRouter from './src/routes/index.js';
import booksRouter from './src/routes/books.js';

import { fileURLToPath } from 'url';



const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();

connectDB()


app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));


app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));


app.use('/emails', indexRouter);
app.use('/api/books', /* auth middleware then */ UserIs("admin"),  booksRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(Validation)
app.use(NotFound)

export default app;
