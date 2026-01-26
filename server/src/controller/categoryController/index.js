const categoryModel = require("../../Model/categoryModel")
const subCategoryModel = require("../../Model/subCategoryModel")

const createCategory = async function (req, res) {
    try {
        const data = req.body
        const postData = new categoryModel(data);
        const categoryData = postData.save()
        if (!categoryData) {
            return res.status(404).json({ success: false, message: "data not found" })
        }
        return res.status(201).json({ success: true, message: "successfully create category", data: categoryData })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}



const subCreateCategory = async function (req, res) {
    try {
        const data = req.body
        console.log(data)
        const postData = new subCategoryModel(data);
        const subCategoryData = postData.save()
        if (!subCategoryData) {
            return res.status(404).json({ success: false, message: "data not found" })
        }
        return res.status(201).json({ success: true, message: "successfully create subCategory", data: subCategoryData })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}



const getCategory = async function (req, res) {
    try {
        const getAllCategory = await categoryModel.find().sort({ createdAt: -1 })
        return res.status(201).json({ success: true, message: "successfully", data: getAllCategory })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}
const getNavbarCategories = async function (req, res) {
    try {
        // Get all categories
        const categories = await categoryModel.find().sort({ createdAt: -1 });

        // Get all subcategories
        const subcategories = await subCategoryModel.find().sort({ createdAt: -1 });

        // Group subcategories by category name
        const navbarCategories = categories.map(category => {
            // Find subcategories that belong to this category
            const categorySubcategories = subcategories.filter(
                subcategory => subcategory.category === category.value
            );

            return {
                id: category._id,
                name: category.value,
                slug: category.value || category.category.toLowerCase().replace(/\s+/g, '-'),
                image: category.image,
                subcategories: categorySubcategories.map(sub => ({
                    id: sub._id,
                    name: sub.subCategory,
                    slug: sub.value || sub.subCategory.toLowerCase().replace(/\s+/g, '-'),
                    image: sub.image,
                    icon: 'alert', // Default icon since not in schema
                    path: `/collections/${sub.value || sub.subCategory.toLowerCase().replace(/\s+/g, '-')}`
                }))
            };
        });

        return res.status(200).json({
            success: true,
            message: "Navbar categories fetched successfully",
            data: navbarCategories
        });

    } catch (error) {
        console.error("Error fetching navbar categories:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getSubCategory = async function (req, res) {
    try {
        const getAllCategory = await subCategoryModel.find().sort({ createdAt: -1 })
        return res.status(201).json({ success: true, message: "successfully", data: getAllCategory })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}


const getSubCategoryByCategoryName = async function (req, res) {
    try {
        const category = req.params.category

        const getAllCategory = await subCategoryModel.find({ category }).sort({ createdAt: -1 })

        return res.status(201).json({ success: true, message: "successfully", data: getAllCategory })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}


const deteletCategory = async function (req, res) {
    try {
        const _id = req.params.id
        const data = await categoryModel.findByIdAndDelete(_id)
        await subCategoryModel.deleteMany({ category: data.value })

        return res.status(201).json({ success: true, message: "successfully" })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}

const deteletSubCategory = async function (req, res) {
    try {
        const _id = req.params.id
        await subCategoryModel.findByIdAndDelete(_id)
        return res.status(201).json({ success: true, message: "successfully" })
    } catch (error) {

        return res.status(500).json({ success: false, message: "internal server error" })

    }
}


const categoriesWithSubcategories = async function (req, res) {
    const categories = await categoryModel.find({}).sort({ createdAt: -1 })
    const categoriesWithSubcategories = [];


    categories.forEach(async category => {

        const subcategories = await subCategoryModel.find({ category: category.category })
        const categoryWithSubcategories = {
            category: category,
            subcategories: subcategories
        };
        categoriesWithSubcategories.push(categoryWithSubcategories);
        if (categoriesWithSubcategories.length === categories.length) {
            res.json(categoriesWithSubcategories);
        }

    });

};

const getCategoryById = async function (req, res) {
    try {
        const category = req.params.id

        const userDetails = await categoryModel.findById(category);

        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User data not found" })
        }

        return res.status(200).json({ success: true, data: userDetails, message: "User detail fetch successfully" })

    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal server error" })
    }


}


const getSubCategoryById = async function (req, res) {
    try {
        const subcategory = req.params.id;
        const subCategoryDetails = await subCategoryModel.findById(subcategory)

        if (!subCategoryDetails) {
            return res.status(404).json({ success: false, message: "Subcategory data not found" })
        }
        return res.status(200).json({ success: true, data: subCategoryDetails, message: "Subcategory detail fetch successfully" })

    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const editCategory = async function (req, res) {
    try {
        const data = req.body;

        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Category ID is missing" });
        }
        const findById = await categoryModel.findById(id)

        const updateCategory = await categoryModel.findByIdAndUpdate(id, { $set: data }, { new: true });

        if (!updateCategory) {
            return res.status(404).json({ success: false, message: "Failed to update category" });
        }

        const updatedSubCategories = await subCategoryModel.updateMany(
            { category: findById.value },
            { $set: { category: updateCategory.value } }
        );



        return res.status(200).json({
            success: true,
            data: updateCategory,
            message: "Category updated successfully"
        });

    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const editSubcategory = async function (req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID is missing" });
        }
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }


        const editSubcategory = await subCategoryModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!editSubcategory) {
            return res.status(404).json({ success: false, message: "Failed to update subcategory" });
        }

        return res.status(200).json({ success: true, data: editSubcategory, message: "Subcategory updated successfully" });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




module.exports = { createCategory, getNavbarCategories, subCreateCategory, getCategoryById, getSubCategoryById, getCategory, getSubCategory, getSubCategoryByCategoryName, deteletCategory, deteletSubCategory, categoriesWithSubcategories, editCategory, editSubcategory }
