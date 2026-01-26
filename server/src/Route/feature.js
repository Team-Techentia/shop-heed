// featuredSectionRoutes.js
const express = require('express');
const {
    createFeaturedSection,
    getAllFeaturedSections,
    getFeaturedSectionById,
    updateFeaturedSection,
    deleteFeaturedSection,
    getActiveFeaturedSections
} = require('../controller/featured/featuredController.js');

const featuredSectionRouter = express.Router();
const auth = require("../auth/index");
const { authenticateToken, adminAuthorisation } = auth;

// Admin routes (protected)
featuredSectionRouter.post("/create-featured-section", createFeaturedSection);
featuredSectionRouter.get("/get-all-featured-sections", getAllFeaturedSections);
featuredSectionRouter.get("/get-featured-section/:id", getFeaturedSectionById);
featuredSectionRouter.put("/update-featured-section/:id", updateFeaturedSection);
featuredSectionRouter.delete("/delete-featured-section/:id", deleteFeaturedSection);

// Public route for frontend
featuredSectionRouter.get("/active-featured-sections", getActiveFeaturedSections);

module.exports = featuredSectionRouter;