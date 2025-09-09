const express = require('express');
const {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    updateBannerStatus,
    getBannersByType,
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
bannerRouter.put("/update-banner-status/:id", authenticateToken, adminAuthorisation, updateBannerStatus);

// Public routes (for frontend display)
bannerRouter.get("/public/active-banners", getActiveBanners);
bannerRouter.get("/public/banners/:bannerType", getBannersByType);

module.exports = bannerRouter;