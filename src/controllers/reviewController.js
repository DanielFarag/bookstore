import Review from '../models/review.js';
import validateReview from '../validation/reviewValidation.js';

export const createReview = async (req, res) => {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const review = new Review({
            user: req.user._id,
            book: req.body.book,
            rating: req.body.rating,
            review: req.body.review
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getReviewsByBook = async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateReview = async (req, res) => {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this review' });
        }

        review.rating = req.body.rating;
        review.review = req.body.review;
        await review.save();
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this review' });
        }
        
        await Review.deleteOne({ _id: req.params.reviewId });
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
