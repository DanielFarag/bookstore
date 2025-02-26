import express, { json, urlencoded } from 'express';
import { join, dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { connectDB }  from './infrastructure/services/index.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


var app = express();

connectDB()


app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));


app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
