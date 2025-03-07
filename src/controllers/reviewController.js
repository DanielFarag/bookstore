import Review from "../models/review.js";
import Book from "../models/book.js";
import validateReview from "../validation/reviewValidation.js";
import { throwIfNotFound } from "../infrastructure/helpers/index.js";
import { io } from "../../bin/www.js"; 

export const createReview = async (req, res) => {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const book = await Book.findById(req.body.book);
    if (!book) throwIfNotFound(book);

    const review = new Review({
        user: req.user.id,
        book: req.body.book,
        rating: req.body.rating,
        review: req.body.review,
    });

    await review.save();
    
    // Emit event for new review
    io.emit("reviewCreated", review);

    res.status(201).json(review);
};

export const getReviewsByBook = async (req, res) => {
    const book = await Book.findById(req.params.bookId);
    if (!book) throwIfNotFound(book);

    const reviews = await Review.find({ book: req.params.bookId });
    res.status(200).json(reviews);
};

export const updateReview = async (req, res) => {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const review = await Review.findById(req.params.reviewId);
    throwIfNotFound(review);

    if (review.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ error: "Unauthorized to update this review" });
    }

    review.rating = req.body.rating;
    review.review = req.body.review;
    await review.save();

    // Emit event for updated review
    io.emit("reviewUpdated", review);

    res.status(200).json(review);
};

export const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    throwIfNotFound(review);

    if (review.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ error: "Unauthorized to delete this review" });
    }

    try {
        await Review.deleteOne({ _id: req.params.reviewId });

        // Emit event for deleted review
        io.emit("reviewDeleted", { reviewId: req.params.reviewId });

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
