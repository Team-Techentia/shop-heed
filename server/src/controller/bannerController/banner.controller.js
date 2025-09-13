const bannerModel = require("../../Model/bannerModel");

// Create a new home banner
const createBanner = async (req, res) => {
    try {
        const data = req.body;

        if (!data.title || !data.image) {
            return res.status(400).json({ success: false, message: "Title and image are required" });
        }

        // Ensure image URL is absolute
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3110";
        if (!data.image.startsWith("http")) {
            data.image = `${baseUrl}${data.image.startsWith("/") ? "" : "/"}${data.image}`;
        }

        data.bannerType = "home";

        // Convert targetCategory and targetSubCategory to ObjectId or null
        data.targetCategory = data.targetCategory ? mongoose.Types.ObjectId(data.targetCategory) : null;
        data.targetSubCategory = data.targetSubCategory ? mongoose.Types.ObjectId(data.targetSubCategory) : null;

        const newBanner = new bannerModel(data);
        const savedBanner = await newBanner.save();

        return res.status(201).json({ 
            success: true, 
            message: "Home banner created successfully", 
            data: savedBanner 
        });

    } catch (error) {
        console.error("Error creating banner:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Get all home banners (admin)
const getAllBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find({ bannerType: "home" })
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({ success: true, message: "Home banners fetched successfully", data: banners });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get banner by ID
const getBannerById = async (req, res) => {
    try {
        const banner = await bannerModel.findById(req.params.id);

        if (!banner || banner.bannerType !== "home") {
            return res.status(404).json({ success: false, message: "Home banner not found" });
        }

        return res.status(200).json({ success: true, message: "Banner fetched successfully", data: banner });
    } catch (error) {
        console.error("Error fetching banner by ID:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update home banner
const updateBanner = async (req, res) => {
    try {
        const data = req.body;
        const bannerId = req.params.id;

        data.bannerType = "home";

        const updatedBanner = await bannerModel.findOneAndUpdate(
            { _id: bannerId, bannerType: "home" },
            { $set: data },
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({ success: false, message: "Home banner not found or update failed" });
        }

        return res.status(200).json({ success: true, message: "Home banner updated successfully", data: updatedBanner });
    } catch (error) {
        console.error("Error updating banner:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete home banner
const deleteBanner = async (req, res) => {
    try {
        const deletedBanner = await bannerModel.findOneAndDelete({ _id: req.params.id, bannerType: "home" });

        if (!deletedBanner) {
            return res.status(404).json({ success: false, message: "Home banner not found" });
        }

        return res.status(200).json({ success: true, message: "Home banner deleted successfully" });
    } catch (error) {
        console.error("Error deleting banner:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get active home banners (public)
const getActiveBanners = async (req, res) => {
    try {
        const activeBanners = await bannerModel.find({ bannerType: "home", isActive: true })
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({ success: true, message: "Active home banners fetched successfully", data: activeBanners });
    } catch (error) {
        console.error("Error fetching active banners:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { 
    createBanner, 
    getAllBanners, 
    getBannerById, 
    updateBanner, 
    deleteBanner, 
    getActiveBanners 
};
