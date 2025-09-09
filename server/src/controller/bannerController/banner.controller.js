const bannerModel = require("../../Model/bannerModel");

// Create a new banner
const createBanner = async function (req, res) {
    try {
        const data = req.body;

        // Validation for banner type specific fields
        if (data.bannerType === 'category' && !data.category) {
            return res.status(400).json({ 
                success: false, 
                message: "Category is required for category banners" 
            });
        }

        if (data.bannerType === 'subcategory' && (!data.category || !data.subCategory)) {
            return res.status(400).json({ 
                success: false, 
                message: "Category and subcategory are required for subcategory banners" 
            });
        }

        // Clear category and subCategory for home banners
        if (data.bannerType === 'home') {
            data.category = null;
            data.subCategory = null;
        }

        const postData = new bannerModel(data);
        const bannerData = await postData.save();

        if (!bannerData) {
            return res.status(404).json({ 
                success: false, 
                message: "Failed to create banner" 
            });
        }

        return res.status(201).json({ 
            success: true, 
            message: "Banner created successfully", 
            data: bannerData 
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get all banners
const getAllBanners = async function (req, res) {
    try {
        const { bannerType, isActive, category, subCategory } = req.query;
        
        // Build filter object
        let filter = {};
        
        if (bannerType) filter.bannerType = bannerType;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;

        const allBanners = await bannerModel.find(filter)
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: "Banners fetched successfully", 
            data: allBanners 
        });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get banner by ID
const getBannerById = async function (req, res) {
    try {
        const userId = req._id;
        const bannerId = req.params.id;

        if (!userId) {
            return res.status(404).json({ 
                success: false, 
                message: "User ID not found" 
            });
        }

        const bannerDetails = await bannerModel.findById(bannerId);

        if (!bannerDetails) {
            return res.status(404).json({ 
                success: false, 
                message: "Banner not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: bannerDetails, 
            message: "Banner details fetched successfully" 
        });
    } catch (error) {
        console.error("Error fetching banner by ID:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Update banner
const updateBanner = async function (req, res) {
    try {
        const userId = req._id;
        const data = req.body;
        const bannerId = req.params.id;

        if (!userId) {
            return res.status(404).json({ 
                success: false, 
                message: "User ID is missing" 
            });
        }

        if (!bannerId) {
            return res.status(404).json({ 
                success: false, 
                message: "Banner ID is missing" 
            });
        }

        // Validation for banner type specific fields
        if (data.bannerType === 'category' && !data.category) {
            return res.status(400).json({ 
                success: false, 
                message: "Category is required for category banners" 
            });
        }

        if (data.bannerType === 'subcategory' && (!data.category || !data.subCategory)) {
            return res.status(400).json({ 
                success: false, 
                message: "Category and subcategory are required for subcategory banners" 
            });
        }

        // Clear category and subCategory for home banners
        if (data.bannerType === 'home') {
            data.category = null;
            data.subCategory = null;
        }

        const updateBanner = await bannerModel.findByIdAndUpdate(
            bannerId, 
            { $set: data }, 
            { new: true }
        );

        if (!updateBanner) {
            return res.status(404).json({ 
                success: false, 
                message: "Failed to update banner" 
            });
        }

        return res.status(200).json({
            success: true,
            data: updateBanner,
            message: "Banner updated successfully"
        });
    } catch (error) {
        console.error("Error updating banner:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Delete banner
const deleteBanner = async function (req, res) {
    try {
        const bannerId = req.params.id;
        
        const deletedBanner = await bannerModel.findByIdAndDelete(bannerId);
        
        if (!deletedBanner) {
            return res.status(404).json({ 
                success: false, 
                message: "Banner not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Banner deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting banner:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Update banner status (activate/deactivate)
const updateBannerStatus = async function (req, res) {
    try {
        const userId = req._id;
        const bannerId = req.params.id;
        const { isActive } = req.body;

        if (!userId) {
            return res.status(404).json({ 
                success: false, 
                message: "User ID is missing" 
            });
        }

        if (!bannerId) {
            return res.status(404).json({ 
                success: false, 
                message: "Banner ID is missing" 
            });
        }

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                message: "isActive must be a boolean value" 
            });
        }

        const updatedBanner = await bannerModel.findByIdAndUpdate(
            bannerId, 
            { $set: { isActive } }, 
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({ 
                success: false, 
                message: "Banner not found" 
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedBanner,
            message: `Banner ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error("Error updating banner status:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get banners by type (for public display)
const getBannersByType = async function (req, res) {
    try {
        const { bannerType } = req.params;
        const { category, subCategory } = req.query;

        let filter = { 
            bannerType, 
            isActive: true 
        };

        if (bannerType === 'category' && category) {
            filter.category = category;
        }

        if (bannerType === 'subcategory' && category && subCategory) {
            filter.category = category;
            filter.subCategory = subCategory;
        }

        const banners = await bannerModel.find(filter)
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: "Banners fetched successfully", 
            data: banners 
        });
    } catch (error) {
        console.error("Error fetching banners by type:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get active banners (public endpoint)
const getActiveBanners = async function (req, res) {
    try {
        const activeBanners = await bannerModel.find({ isActive: true })
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: "Active banners fetched successfully", 
            data: activeBanners 
        });
    } catch (error) {
        console.error("Error fetching active banners:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

module.exports = { 
    createBanner, 
    getAllBanners, 
    getBannerById, 
    updateBanner, 
    deleteBanner, 
    updateBannerStatus,
    getBannersByType,
    getActiveBanners
};