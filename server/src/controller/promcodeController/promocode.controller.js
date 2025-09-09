const promocodeModel = require("../../Model/promocode");

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
        const existingPromocode = await promocodeModel.findOne({ 
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

        const postData = new promocodeModel(data);
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

        const promocodes = await promocodeModel
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalPromocodes = await promocodeModel.countDocuments(filter);
        
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

        const promocodeDetails = await promocodeModel.findById(promocodeId);

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
            const existingPromocode = await promocodeModel.findOne({ 
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

        const updatePromocode = await promocodeModel.findByIdAndUpdate(
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

        const deletePromocode = await promocodeModel.findByIdAndUpdate(
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

const validatePromocode = async function (req, res) {
    try {
        const { code, userId, cartTotal, products, categories } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: "Promocode is required" });
        }

        const promocode = await promocodeModel.findOne({ 
            code: code.toUpperCase(), 
            isDeleted: false 
        });

        if (!promocode) {
            return res.status(404).json({ success: false, message: "Invalid promocode" });
        }

        // Check if promocode is active
        if (!promocode.isActive) {
            let message = "Promocode is not active";
            const now = new Date();
            
            if (!promocode.status) {
                message = "Promocode is disabled";
            } else if (promocode.startDate && promocode.startDate > now) {
                message = "Promocode is not yet active";
            } else if (promocode.endDate && promocode.endDate < now) {
                message = "Promocode has expired";
            } else if (promocode.perLimit && promocode.usedQuantity >= promocode.perLimit) {
                message = "Promocode usage limit exceeded";
            } else if (promocode.quantity && promocode.usedQuantity >= promocode.quantity) {
                message = "Promocode usage limit exceeded";
            }
            
            return res.status(400).json({ success: false, message });
        }

        // Check user-specific usage limits
        if (userId && !promocode.canBeUsedByUser(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: "You have exceeded the usage limit for this promocode" 
            });
        }

        // Check minimum spend
        if (promocode.minimumSpend && cartTotal < promocode.minimumSpend) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum spend of $${promocode.minimumSpend} required` 
            });
        }

        // Check maximum spend (if still exists in old promocodes)
        if (promocode.maximumSpend && cartTotal > promocode.maximumSpend) {
            return res.status(400).json({ 
                success: false, 
                message: `Maximum spend of $${promocode.maximumSpend} exceeded` 
            });
        }

        // Check product restrictions
        if (promocode.products && promocode.products.length > 0 && products) {
            const hasValidProduct = products.some(product => 
                promocode.products.includes(product)
            );
            if (!hasValidProduct) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Promocode is not valid for the products in your cart" 
                });
            }
        }

        // Check category restrictions
        if (promocode.categories && promocode.categories.length > 0 && categories) {
            const hasValidCategory = categories.some(category => 
                promocode.categories.includes(category)
            );
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

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

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
        const { code, userId } = req.body;

        if (!code || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: "Promocode and user ID are required" 
            });
        }

        const promocode = await promocodeModel.findOne({ 
            code: code.toUpperCase(), 
            isDeleted: false 
        });

        if (!promocode || !promocode.isActive) {
            return res.status(404).json({ success: false, message: "Invalid or inactive promocode" });
        }

        if (!promocode.canBeUsedByUser(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Usage limit exceeded for this promocode" 
            });
        }

        await promocode.applyUsage(userId);

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