const express = require('express');
const {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getPublishedReviews,
    sendReviewRequestEmail,
    sendReviewEmail,
    approveReview
} = require('../controller/review.controller');

const reviewRouter = express.Router();
const auth = require("../auth/index");
const { authenticateToken, adminAuthorisation } = auth;

// Public routes
reviewRouter.post("/submit-review", createReview);
reviewRouter.get("/public/published-reviews", getPublishedReviews);

// Admin routes (protected)
reviewRouter.get("/get-all-reviews", getAllReviews);
reviewRouter.get("/get-review/:id",  getReviewById);
reviewRouter.put("/update-review/:id", updateReview);
reviewRouter.delete("/delete-review/:id", deleteReview);
reviewRouter.post("/send-email/:id", sendReviewEmail);
reviewRouter.patch("/approve-review/:id", approveReview);

reviewRouter.post("/send-review-request", sendReviewRequestEmail);
module.exports = reviewRouter;