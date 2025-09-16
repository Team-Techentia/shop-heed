const express = require('express');
const {createCategory,subCreateCategory,getCategoryById ,editSubcategory,editCategory,getSubCategoryById,getCategory,getSubCategory,getSubCategoryByCategoryName ,deteletSubCategory,deteletCategory , categoriesWithSubcategories, getNavbarCategories} = require('../controller/categoryController');
const categoryRouter = express.Router();
const auth = require("../auth/index")
const { authenticateToken, adminAuthorisation } = auth


categoryRouter.post("/create-category",authenticateToken, adminAuthorisation,createCategory)
categoryRouter.post("/create-subcategory",authenticateToken, adminAuthorisation,subCreateCategory)
categoryRouter.get("/get-category/:id",authenticateToken,adminAuthorisation,getCategoryById)
categoryRouter.get("/get-sub-category/:id",authenticateToken,adminAuthorisation,getSubCategoryById)
categoryRouter.get("/get-category",getCategory)
categoryRouter.get("/get-subcategory",getSubCategory)
categoryRouter.get("/navbar-categories", getNavbarCategories);
categoryRouter.get("/get-subcategory-by-name/:category",getSubCategoryByCategoryName)
categoryRouter.delete("/delete-category/:id" ,authenticateToken, adminAuthorisation,deteletCategory)
categoryRouter.delete("/delete-subcategory/:id" ,authenticateToken, adminAuthorisation,deteletSubCategory)
categoryRouter.put("/edit-category/:id",authenticateToken, adminAuthorisation,editCategory)
categoryRouter.put("/edit-sub-category/:id",authenticateToken, adminAuthorisation,editSubcategory)



module.exports = categoryRouter;
