const express = require("express");
const router = express.Router()
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const ImageUploadController =  require("../controller/imageUploadController")
const auth = require("../auth/index")
const email = require("../controller/emailController/index")
const cartController = require('../controller/cartController')
const { authenticateToken, userAuthorisation } = auth



router.post("/contact-us", email.contactUs);

router.post("/bulk-enquiry", email.BulkEnquiry);



router.post("/upload-single-image", upload.single("image"), ImageUploadController.singleImage);

router.post("/upload-bulk-image", upload.array("image"), ImageUploadController.uploadBulkImage);


router.post('/add-to-cart',authenticateToken,cartController.AddToCart)

router.get('/get-cart/',authenticateToken,cartController.getCart)

router.delete('/cart-delete/:itemId',authenticateToken, cartController.removeFromCart);

router.delete('/delete-cart/',authenticateToken,cartController.deteteCart)






module.exports = router