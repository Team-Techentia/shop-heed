const express = require("express");
const { addAddress, getUserAddresses, updateAddress, deleteAddress } = require("../controller/addressController.js");
const { authenticateToken } = require("../auth/index.js");

const addressRouter = express.Router();

addressRouter.post("/address", authenticateToken, addAddress);
addressRouter.get("/address", authenticateToken, getUserAddresses);
addressRouter.put("/address/:id", authenticateToken, updateAddress);
addressRouter.delete("/address/:id", authenticateToken, deleteAddress);

module.exports = addressRouter;
