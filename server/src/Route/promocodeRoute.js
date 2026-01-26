const express = require('express');
const { createPromocode, getAllPromocodes, getPromocodeById, updatePromocode, deletePromocode, validatePromocode, applyPromocode } = require('../controller/promcodeController/promocode.controller.js');

const promocodeRouter = express.Router();
const auth = require("../auth/index.js");
const { Promocode } = require('../Model/promocode.js');
const { authenticateToken, adminAuthorisation } = auth;

// Admin routes (require admin authorization)
promocodeRouter.post("/create-promocode", createPromocode);
promocodeRouter.get("/get-all-promocodes", getAllPromocodes);
promocodeRouter.get("/get-promocode/:id", getPromocodeById);
promocodeRouter.put("/update-promocode/:id", updatePromocode);
promocodeRouter.delete("/delete-promocode/:id", deletePromocode);

// Public routes (for customers)
promocodeRouter.post("/validate-promocode", validatePromocode);
promocodeRouter.post("/apply-promocode", applyPromocode);

// Additional utility routes
promocodeRouter.get("/active-promocodes", async (req, res) => {
    try {
        const now = new Date();
        const activePromocodes = await Promocode.find({
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