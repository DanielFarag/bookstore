import express from 'express';
import { authenticate } from '../infrastructure/middlewares/auth.middleware.js';
import { createReview, getReviewsByBook, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/books/:bookId/reviews', authenticate, getReviewsByBook);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

export default router;