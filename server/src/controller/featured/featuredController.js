// featuredSectionController.js
const categoryModel = require("../../Model/categoryModel.js");
const FeaturedSection = require("../../Model/featuredSection.js");
const subCategoryModel = require("../../Model/subCategoryModel.js");

// Create a new featured section
const createFeaturedSection = async (req, res) => {
    try {
        const data = req.body;

        if (!data.category) {
            return res.status(400).json({
                success: false,
                message: "category is required"
            });
        }

        // Check if similar section already exists
        const existingSection = await FeaturedSection.findOne({
            category: data.category,
            subCategory: data.subCategory || null,
            isActive: true
        });

        if (existingSection) {
            return res.status(400).json({
                success: false,
                message: "An active featured section already exists for this category/subcategory combination"
            });
        }

        const existingPrioritySection = await FeaturedSection.findOne({
            priority: data.priority,
            isActive: true
        });

        if (existingPrioritySection) {
            return res.status(400).json({
                success: false,
                message: "An active featured section already exists for this priority"
            });
        }

        let sectionDoc;
        let imageUrl = "";

        if (data.subCategory) {
            // Query for subcategory - Fixed the query structure
            sectionDoc = await subCategoryModel.findOne({
                category: data.category,
                value: data.subCategory  // Changed from subCategory to value
            });
            
            if (!sectionDoc) {
                return res.status(404).json({
                    success: false,
                    message: "Subcategory not found"
                });
            }
            imageUrl = sectionDoc.image;
        } else {
            // Query for category only
            sectionDoc = await categoryModel.findOne({
                value: data.category
            });
            
            if (!sectionDoc) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }
            imageUrl = sectionDoc.image;
        }

        const newSection = new FeaturedSection({
            category: data.category,
            subCategory: data.subCategory || null,
            priority: data.priority || 1,
            description: data.description || "",
            image: imageUrl,
            isActive: true
        });

        const savedSection = await newSection.save();

        return res.status(201).json({
            success: true,
            message: "Featured section created successfully",
            data: savedSection
        });

    } catch (error) {
        console.error("Error creating featured section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all featured sections (admin)
const getAllFeaturedSections = async (req, res) => {
    try {
        const sections = await FeaturedSection.find({})
            .sort({ priority: 1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Featured sections fetched successfully",
            data: sections
        });
    } catch (error) {
        console.error("Error fetching featured sections:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get featured section by ID
const getFeaturedSectionById = async (req, res) => {
    try {
        const section = await FeaturedSection.findById(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Featured section not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Featured section fetched successfully",
            data: section
        });
    } catch (error) {
        console.error("Error fetching featured section by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update featured section
const updateFeaturedSection = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Check if updating to a combination that already exists
        if (data.category) {
            const existingSection = await FeaturedSection.findOne({
                _id: { $ne: id }, // Exclude current section
                category: data.category,
                subCategory: data.subCategory || null,
                isActive: true
            });

            if (existingSection) {
                return res.status(400).json({
                    success: false,
                    message: "An active featured section already exists for this category/subcategory combination"
                });
            }
        }

        const existingPrioritySection = await FeaturedSection.findOne({
            priority: data.priority,
            isActive: true
        });

        if (existingPrioritySection && existingPrioritySection._id.toString() !== id) {
            return res.status(400).json({
                success: false,
                message: "An active featured section already exists for this priority"
            });
        }

        const updatedSection = await FeaturedSection.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Featured section not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Featured section updated successfully",
            data: updatedSection
        });

    } catch (error) {
        console.error("Error updating featured section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete featured section
const deleteFeaturedSection = async (req, res) => {
    try {
        const deletedSection = await FeaturedSection.findByIdAndDelete(req.params.id);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Featured section not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Featured section deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting featured section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get active featured sections (public route for frontend)
const getActiveFeaturedSections = async (req, res) => {
    try {
        const activeSections = await FeaturedSection.find({ isActive: true })
            .sort({ priority: 1, createdAt: -1 })
            .select('category subCategory priority createdAt');

        return res.status(200).json({
            success: true,
            message: "Active featured sections fetched successfully",
            data: activeSections
        });
    } catch (error) {
        console.error("Error fetching active featured sections:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createFeaturedSection,
    getAllFeaturedSections,
    getFeaturedSectionById,
    updateFeaturedSection,
    deleteFeaturedSection,
    getActiveFeaturedSections
};