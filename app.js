import express, { json, urlencoded } from "express";
import { join, dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";

import { connectDB, swaggerDocs } from "./src/infrastructure/services/index.js";
import {
  NotFound,
  Validation,
} from "./src/infrastructure/middlewares/index.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import indexRouter from "./src/routes/index.js";
import booksRouter from "./src/routes/books.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";


import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const accessLogStream = fs.createWriteStream(path.join('access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream })); 
app.use(morgan('dev')); 

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use(authRoutes);
app.use(userRoutes);
app.use("/emails", indexRouter);
app.use("/api/books", booksRouter);
app.use("/api/reviews", reviewRoutes);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(Validation);
app.use(NotFound);

export default app;


