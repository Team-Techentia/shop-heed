const express = require("express");
const productRoute = express();
const product = require("../controller/productController/index")
const auth = require("../auth/index")
const { authenticateToken, userAuthorisation, adminAuthorisation } = auth

const { createComments, getComments, getCommentByProductId, checkReviewInListing, updateReview, deleteReview } = require('../controller/productCommentsControllers/index')
productRoute.post("/create-product", product.createProduct)

productRoute.get("/get-all-product", product.get_All_Product);
productRoute.get("/get-new-product", product.get_NEW_Product);
productRoute.get("/get-all-product-admin", product.get_All_Product_Admin);
productRoute.get("/get-all-product-admin-by-id/:id", product.get_All_Product_Admin_by_id);

productRoute.get("/get-product/:id", product.get_Product_By_Id)
productRoute.get("/get-all-sameProduct-by-id/:id", product.getAllSameProductById)



productRoute.put("/update-product/:id", product.updated_main_Product)
productRoute.put("/delete-product/:id", product.delete_main_Product)

productRoute.put("/update-sub-product/:id", product.updated_Product)

productRoute.get('/filter-products', product.filterProduct)
productRoute.get('/filter-productsV2', product.filterProductV2)

productRoute.get('/filter-products-sidebar', product.searchProductsHomePage)

productRoute.get('/all-brands', product.AllBrands)


productRoute.post("/create-comments/:productId/comments", authenticateToken, createComments)
productRoute.get("/get-comments/:productId", getComments)
productRoute.get("/check-user-in-comments/:productId", authenticateToken, checkReviewInListing)
productRoute.put("/update-comments/:productId", authenticateToken, updateReview)
productRoute.get("/delete/products/comments/:productId/:commentId", deleteReview)
productRoute.get("/get/product/comments/:id", getCommentByProductId)
productRoute.get("/service/availability", product.serviceAvailability);

module.exports = productRoute
