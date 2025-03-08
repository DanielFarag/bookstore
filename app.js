import express, { json, urlencoded } from 'express'
import { join, dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import morgan from 'morgan'
import fs from 'fs'
import cors from 'cors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import { connectDB, swaggerDocs } from './src/infrastructure/services/index.js'
import { NotFound, UnCaughtExceptions, Validation } from './src/infrastructure/middlewares/index.js'

import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import booksRouter from './src/routes/books.js'
import reviewRoutes from './src/routes/reviewRoutes.js'
import cartRoutes from './src/routes/cart.js'
import orderRoutes from './src/routes/order.js'

import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

const accessLogStream = fs.createWriteStream(path.join('access.log'), {
    flags: 'a',
})

app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

connectDB()

app.set('views', join(__dirname, 'views'))

app.use(logger('dev'))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))

app.use(authRoutes)
app.use(userRoutes)

app.get('/mailhog', (req,res,next)=>{
    const host = req.headers.host.split(':')[0]; 
    res.redirect(`http://${host}:8025`);
})

app.use('/api/books', booksRouter)
app.use('/api/reviews', reviewRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(Validation)
app.use(NotFound)
app.use(UnCaughtExceptions)

export default app
