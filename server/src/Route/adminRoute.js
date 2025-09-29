const express = require("express");
const adminRoute = express()
const auth = require("../auth/index")
const { authenticateToken, adminAuthorisation } = auth
const { getAllUser, getUserById } = require("../controller/adminController/user")
const { getOrder, getOrderById, updateOrder, get_All_Orders } = require("../controller/adminController/order")
const { getAllPayment } = require("../controller/adminController/payment")
const { adminPannel } = require("../controller/adminController/dashBoard")


adminRoute.get("/all-user", authenticateToken, adminAuthorisation, getAllUser)
adminRoute.get("/all-user-by-id/:id", authenticateToken, adminAuthorisation, getUserById)
adminRoute.get("/admin-panel", authenticateToken, adminAuthorisation, adminPannel)




adminRoute.get("/get-order", authenticateToken, adminAuthorisation, getOrder)
adminRoute.get("/get-order/:Id", authenticateToken, adminAuthorisation, getOrderById)
adminRoute.put("/update-order/:Id", authenticateToken, adminAuthorisation, updateOrder)
adminRoute.get("/get-all-payment", getAllPayment)

adminRoute.get("/get-all/orders", authenticateToken, adminAuthorisation, get_All_Orders)


module.exports = adminRoute