const express = require('express');
const {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    getActiveBanners
} = require('../controller/bannerController/banner.controller');

const bannerRouter = express.Router();
const auth = require("../auth/index");
const { authenticateToken, adminAuthorisation } = auth;

// Admin routes (protected)
bannerRouter.post("/create-banner", authenticateToken, adminAuthorisation, createBanner);
bannerRouter.get("/get-all-banners", authenticateToken, adminAuthorisation, getAllBanners);
bannerRouter.get("/get-banner/:id", authenticateToken, adminAuthorisation, getBannerById);
bannerRouter.put("/update-banner/:id", authenticateToken, adminAuthorisation, updateBanner);
bannerRouter.delete("/delete-banner/:id", authenticateToken, adminAuthorisation, deleteBanner);

// Public route for home page carousel
bannerRouter.get("/public/active-banners", getActiveBanners);

module.exports = bannerRouter;
