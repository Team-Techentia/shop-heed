const express = require("express");
const router = express.Router();

// Middleware
const upload = require("../middlewares/upload");
const auth = require("../auth/index");
const { authenticateToken, userAuthorisation } = auth;

// Controllers
const ImageUploadController = require("../Controller/ImageUploadController");
const emailController = require("../controller/emailController/index");
const cartController = require("../controller/cartController");

// =======================
// Email / Contact Routes
// =======================
router.post("/contact-us", emailController.contactUs);
router.post("/bulk-enquiry", emailController.BulkEnquiry);

// =======================
// Image Upload Routes
// =======================
router.post("/upload-single-image", upload.single("image"), ImageUploadController.singleImage);
router.post("/upload/bulk", upload.array("images", 10), ImageUploadController.uploadBulkImage);
router.delete("/delete/:publicId", ImageUploadController.deleteImage);

// =======================
// Cart Routes
// =======================
router.post("/add-to-cart", authenticateToken, cartController.AddToCart);
router.get("/get-cart", authenticateToken, cartController.getCart);
router.delete("/cart-delete/:itemId", authenticateToken, cartController.removeFromCart);
router.delete("/delete-cart", authenticateToken, cartController.deteteCart);

module.exports = router;
