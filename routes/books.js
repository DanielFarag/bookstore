import { Router } from 'express';
import { BookController } from '../controllers/index.js';
import { asyncHandler } from "../infrastructure/helpers/index.js";
import { validator } from "../infrastructure/middlewares/index.js";
import { bookRequestSchema } from '../requests/index.js';


var router = Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Get a list of all books available on the system.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: The number of books per page.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 67bf79a343fba91baeeff7bc
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *       403:
 *         description: User is unauthorized to perform this action [ only admin is allowed ].
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized to access this resource"
 * 
 */
router.get('/', asyncHandler(BookController.index));


/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Retrieve a book resource
 *     description: Get a book resource using id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 67bf79a343fba91baeeff7bc
 *     responses:
 *       200:
 *         description: A book resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "record not found"
 */
router.get('/:id', asyncHandler(BookController.show));

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a book
 *     description: Create a new book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "book title"
 *               author:
 *                 type: string
 *                 example: "Author Name"
 *               price:
 *                 type: number
 *                 example: 50
 *               stock:
 *                 type: number
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: "book description sample"
 *               image:
 *                 type: string
 *                 example: "Image url"
 *     responses:
 *       422:
 *         description: Book is unprocessible due to validation issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         example: title
 *                       type:
 *                         type: string
 *                         example: "any.required"
 *                       message:
 *                         type: string
 *                         example: "Title is required"
 *       201:
 *         description: book resource created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 67bf79a343fba91baeeff7bc
 *                 title:
 *                   type: string
 *                   example: "Book title"
 *                 author:
 *                   type: string
 *                   example: "Book author"
 *                 price:
 *                   type: number
 *                   example: 10
 *                 stock:
 *                   type: number
 *                   example: 20
 *                 description:
 *                   type: string
 *                   example: "book description"
 *                 image:
 *                   type: string
 *                   example: "url"
 */
router.post('/', validator(bookRequestSchema.create), asyncHandler(BookController.store));


/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Update a book.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 67bf79a343fba91baeeff7bc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: A book resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 67bf79a343fba91baeeff7bc
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "test@gmail.com"
 *                 role:
 *                   type: string
 *                   example: "admin"
 */
router.put('/:id', asyncHandler(BookController.update));




/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 67bf79a343fba91baeeff7bc
 *     responses:
 *       200:
 *         description: Delete book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 67bf79a343fba91baeeff7bc
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "test@gmail.com"
 *                 role:
 *                   type: string
 *                   example: "admin"
 */
router.delete('/:id', asyncHandler(BookController.remove));


export default router;