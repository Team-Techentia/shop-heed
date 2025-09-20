const { Promocode } = require("../../Model/promocode.js");

const createPromocode = async function (req, res) {
    try {
        const data = req.body;

        // Validate required fields (reduced requirements)
        if (!data.name || !data.code || !data.discountType || !data.discountValue) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, code, discountType, discountValue"
            });
        }

        // Validate dates only if both are provided
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    message: "End date must be after start date"
                });
            }
        }

        // Validate discount value based on type
        if (data.discountType === 'percent' && (data.discountValue < 0 || data.discountValue > 100)) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount must be between 0 and 100"
            });
        }

        if (data.discountType === 'fixed' && data.discountValue < 0) {
            return res.status(400).json({
                success: false,
                message: "Fixed discount amount cannot be negative"
            });
        }

        // Check if promocode with same code already exists
        const existingPromocode = await Promocode.findOne({
            code: data.code.toUpperCase(),
            isDeleted: false
        });

        if (existingPromocode) {
            return res.status(400).json({
                success: false,
                message: "Promocode with this code already exists"
            });
        }

        // Ensure code is uppercase
        data.code = data.code.toUpperCase();

        // Clean up data - remove empty arrays and null values
        if (data.categories && data.categories.length === 0) {
            delete data.categories;
        }
        if (data.products && data.products.length === 0) {
            delete data.products;
        }

        // Handle numeric fields - convert empty strings to null
        ['minimumSpend', 'perLimit', 'perCustomer', 'quantity'].forEach(field => {
            if (data[field] === '' || data[field] === 0) {
                data[field] = null;
            }
        });

        const postData = new Promocode(data);
        const promocodeData = await postData.save();

        if (!promocodeData) {
            return res.status(404).json({ success: false, message: "Failed to create promocode" });
        }

        return res.status(201).json({
            success: true,
            message: "Successfully created promocode",
            data: promocodeData
        });
    } catch (error) {
        console.error('Create promocode error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const getAllPromocodes = async function (req, res) {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const filter = { isDeleted: false };

        if (status !== undefined) {
            filter.status = status === 'true';
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        const promocodes = await Promocode
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalPromocodes = await Promocode.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved promocodes",
            data: promocodes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPromocodes / limit),
                totalPromocodes,
                hasNextPage: page < Math.ceil(totalPromocodes / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get all promocodes error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getPromocodeById = async function (req, res) {
    try {
        const userId = req._id;
        const promocodeId = req.params.id;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User id not found" });
        }

        const promocodeDetails = await Promocode.findById(promocodeId);

        if (!promocodeDetails || promocodeDetails.isDeleted) {
            return res.status(404).json({ success: false, message: "Promocode not found" });
        }

        return res.status(200).json({
            success: true,
            data: promocodeDetails,
            message: "Promocode details fetched successfully"
        });

    } catch (error) {
        console.error('Get promocode by ID error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updatePromocode = async function (req, res) {
    try {
        const userId = req._id;
        const data = req.body;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User ID is missing" });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Promocode ID is missing" });
        }

        // If code is being updated, ensure it's uppercase and unique
        if (data.code) {
            data.code = data.code.toUpperCase();
            const existingPromocode = await Promocode.findOne({
                code: data.code,
                _id: { $ne: id },
                isDeleted: false
            });
            if (existingPromocode) {
                return res.status(400).json({
                    success: false,
                    message: "Promocode with this code already exists"
                });
            }
        }

        // Validate dates if provided
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    message: "End date must be after start date"
                });
            }
        }

        // Clean up data - handle empty values
        if (data.categories && data.categories.length === 0) {
            data.categories = [];
        }
        if (data.products && data.products.length === 0) {
            data.products = [];
        }

        // Handle numeric fields
        ['minimumSpend', 'perLimit', 'perCustomer', 'quantity'].forEach(field => {
            if (data[field] === '' || data[field] === 0) {
                data[field] = null;
            }
        });

        const updatePromocode = await Promocode.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!updatePromocode) {
            return res.status(404).json({ success: false, message: "Failed to update promocode" });
        }

        return res.status(200).json({
            success: true,
            data: updatePromocode,
            message: "Promocode updated successfully"
        });

    } catch (error) {
        console.error('Update promocode error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deletePromocode = async function (req, res) {
    try {
        const userId = req._id;
        const id = req.params.id;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User ID is missing" });
        }

        if (!id) {
            return res.status(404).json({ success: false, message: "Promocode ID is missing" });
        }

        const deletePromocode = await Promocode.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!deletePromocode) {
            return res.status(404).json({ success: false, message: "Promocode not found" });
        }

        return res.status(200).json({ success: true, message: "Promocode deleted successfully" });
    } catch (error) {
        console.error('Delete promocode error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const validatePromocode = async (req, res) => {
    try {
        const { code, cartTotal, products, categories } = req.body;
        const userId = req._id; // logged-in user ID (optional)

        if (!code) {
            return res.status(400).json({ success: false, message: "Promocode is required" });
        }

        // Fetch promocode from database
        const promocode = await Promocode.findOne({
            code: code.toUpperCase(),
            isDeleted: false
        });

        if (!promocode) {
            return res.status(404).json({ success: false, message: "Invalid promocode" });
        }

        const now = new Date();

        // Check if promocode is active and within date limits
        if (!promocode.isActive || (promocode.startDate && promocode.startDate > now) || (promocode.endDate && promocode.endDate < now)) {
            let message = "Promocode is not active";
            if (!promocode.isActive) message = "Promocode is disabled";
            else if (promocode.startDate && promocode.startDate > now) message = "Promocode is not yet active";
            else if (promocode.endDate && promocode.endDate < now) message = "Promocode has expired";

            return res.status(400).json({ success: false, message });
        }

        // Total usage limits
        if ((promocode.perLimit && promocode.usedQuantity >= promocode.perLimit) ||
            (promocode.quantity && promocode.usedQuantity >= promocode.quantity)) {
            return res.status(400).json({ success: false, message: "Promocode usage limit exceeded" });
        }

        // User-specific usage limits (only check, do not mark used)
        if (userId && !promocode.canBeUsedByUser(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have exceeded the usage limit for this promocode"
            });
        }

        // Minimum spend check
        if (typeof promocode.minimumSpend === 'number' && cartTotal < promocode.minimumSpend) {
            return res.status(400).json({
                success: false,
                message: `Minimum spend of $${promocode.minimumSpend} required`
            });
        }

        // Category restrictions
        if (promocode.categories?.length > 0 && categories?.length > 0) {
            const hasValidCategory = categories.some(cat => promocode.categories.includes(cat));
            if (!hasValidCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Promocode is not valid for the product categories in your cart"
                });
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (promocode.discountType === 'percent') {
            discountAmount = (cartTotal * promocode.discountValue) / 100;
        } else {
            discountAmount = promocode.discountValue;
        }

        // Ensure discount does not exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        // ✅ Return promocode info without marking it used
        return res.status(200).json({
            success: true,
            message: "Promocode is valid",
            data: {
                promocode: {
                    id: promocode._id,
                    name: promocode.name,
                    code: promocode.code,
                    discountType: promocode.discountType,
                    discountValue: promocode.discountValue,
                    freeShipping: promocode.freeShipping
                },
                discountAmount,
                freeShipping: promocode.freeShipping
            }
        });

    } catch (error) {
        console.error('Validate promocode error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const applyPromocode = async function (req, res) {
    try {
        const { code, orderTotal } = req.body;
        const userId = req._id;

        if (!code || !userId) {
            return res.status(400).json({
                success: false,
                message: "Promocode and user ID are required"
            });
        }

        const promocode = await Promocode.findOne({
            code: code.toUpperCase(),
            isDeleted: false
        });

        if (!promocode || !promocode.isActive) {
            return res.status(404).json({ success: false, message: "Invalid or inactive promocode" });
        }

        console.log("canBeUsedByUser",userId,promocode.canBeUsedByUser(userId))
        if (!promocode.canBeUsedByUser(userId)) {
            console.log("canBeUsedByUser",userId)
            return res.status(400).json({
                success: false,
                message: "Usage limit exceeded for this promocode"
            });
        }

        if (orderTotal < promocode.minimumSpend) {
            return res.status(400).json({
                success: false,
                message: `Minimum spend required for this promocode is ${promocode.minimumSpend}`
            });
        }
        

        return res.status(200).json({
            success: true,
            message: "Promocode applied successfully",
            data: promocode
        });

    } catch (error) {
        console.error('Apply promocode error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createPromocode,
    getAllPromocodes,
    getPromocodeById,
    updatePromocode,
    deletePromocode,
    validatePromocode,
    applyPromocode
};