import express from 'express';
import { authenticate } from '../infrastructure/middlewares/auth.middleware.js';
import { createReview, getReviewsByBook, updateReview, deleteReview } from '../controllers/reviewController.js';
import { asyncHandler } from "../infrastructure/helpers/index.js";

const router = express.Router();

router.post('/', authenticate, asyncHandler(createReview));
router.get('/books/:bookId/reviews', asyncHandler(getReviewsByBook));
router.put('/:reviewId', authenticate, asyncHandler(updateReview));
router.delete('/:reviewId', authenticate, asyncHandler(deleteReview));

export default router;