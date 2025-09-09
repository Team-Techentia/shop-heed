const express = require('express');
const { createPromocode, getAllPromocodes, getPromocodeById, updatePromocode, deletePromocode, validatePromocode, applyPromocode } = require('../controller/promcodeController/promocode.controller');

const promocodeRouter = express.Router();
const auth = require("../auth/index");
const { authenticateToken, adminAuthorisation } = auth;

// Admin routes (require admin authorization)
promocodeRouter.post("/create-promocode", authenticateToken, adminAuthorisation, createPromocode);
promocodeRouter.get("/get-all-promocodes", authenticateToken, adminAuthorisation, getAllPromocodes);
promocodeRouter.get("/get-promocode/:id", authenticateToken, adminAuthorisation, getPromocodeById);
promocodeRouter.put("/update-promocode/:id", authenticateToken, adminAuthorisation, updatePromocode);
promocodeRouter.delete("/delete-promocode/:id", authenticateToken, adminAuthorisation, deletePromocode);

// Public routes (for customers)
promocodeRouter.post("/validate-promocode", validatePromocode);
promocodeRouter.post("/apply-promocode", authenticateToken, applyPromocode);

// Additional utility routes
promocodeRouter.get("/active-promocodes", async (req, res) => {
    try {
        const now = new Date();
        const activePromocodes = await require("../../Model/promocodeModel").find({
            status: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
            isDeleted: false,
            $expr: { $lt: ["$usedQuantity", "$quantity"] }
        }).select('name code discountType discountValue freeShipping startDate endDate');

        return res.status(200).json({
            success: true,
            message: "Active promocodes retrieved successfully",
            data: activePromocodes
        });
    } catch (error) {
        console.error('Get active promocodes error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = promocodeRouter;