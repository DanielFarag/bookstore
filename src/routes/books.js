import { Router } from 'express';
import { BookController } from '../controllers/index.js';
import { asyncHandler } from "../infrastructure/helpers/index.js";
import { validator } from "../infrastructure/middlewares/index.js";
import { bookRequestSchema } from '../requests/index.js';
import { multer } from '../infrastructure/services/index.js';
import {
  authenticate,
  authorizeRole,
} from "../infrastructure/middlewares/auth.middleware.js";


var router = Router();


router.get('/', asyncHandler(BookController.index));
router.get('/:id', asyncHandler(BookController.show));
router.post('/', authenticate, authorizeRole("admin"), multer.single('image'), validator(bookRequestSchema.create), asyncHandler(BookController.store));
router.put('/:id', authenticate, authorizeRole("admin"), multer.single('image'), validator(bookRequestSchema.create), asyncHandler(BookController.update));
router.delete('/:id', authenticate, authorizeRole("admin"), asyncHandler(BookController.remove));


export default router;