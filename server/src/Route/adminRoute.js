const express = require("express");
const adminRoute = express()
const auth = require("../auth/index")
const { authenticateToken, adminAuthorisation } = auth
const { getAllUser, getUserById } = require("../controller/adminController/user")
const { getOrder, getOrderById, updateOrder, get_All_Orders } = require("../controller/adminController/order")
const { getAllPayment } = require("../controller/adminController/payment")
const { adminPannel } = require("../controller/adminController/dashBoard")


adminRoute.get("/all-user", getAllUser)
adminRoute.get("/all-user-by-id/:id", getUserById)
adminRoute.get("/admin-panel",  adminPannel)




adminRoute.get("/get-order",  getOrder)
adminRoute.get("/get-order/:Id", getOrderById)
adminRoute.put("/update-order/:Id", updateOrder)
adminRoute.get("/get-all-payment", getAllPayment)

adminRoute.get("/get-all/orders",  get_All_Orders)


module.exports = adminRoute