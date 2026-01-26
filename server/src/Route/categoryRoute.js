const express = require('express');
const { createCategory, subCreateCategory, getCategoryById, editSubcategory, editCategory, getSubCategoryById, getCategory, getSubCategory, getSubCategoryByCategoryName, deteletSubCategory, deteletCategory, categoriesWithSubcategories, getNavbarCategories } = require('../controller/categoryController');
const categoryRouter = express.Router();
const auth = require("../auth/index")
const { authenticateToken, adminAuthorisation } = auth


categoryRouter.post("/create-category", createCategory)
categoryRouter.post("/create-subcategory", subCreateCategory)
categoryRouter.get("/get-category/:id", getCategoryById)
categoryRouter.get("/get-sub-category/:id", getSubCategoryById)
categoryRouter.get("/get-category", getCategory)
categoryRouter.get("/get-subcategory", getSubCategory)
categoryRouter.get("/navbar-categories", getNavbarCategories);
categoryRouter.get("/get-subcategory-by-name/:category", getSubCategoryByCategoryName)
categoryRouter.delete("/delete-category/:id", deteletCategory)
categoryRouter.delete("/delete-subcategory/:id", deteletSubCategory)
categoryRouter.put("/edit-category/:id", editCategory)
categoryRouter.put("/edit-sub-category/:id", editSubcategory)



module.exports = categoryRouter;
