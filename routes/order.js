const express = require("express");
const router = express.Router();
const { Order, ProductCart } = require("../models/order");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const {getUserById,userPurchaseList,pushOrderInPurchaseList} = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { getOrderId, createOrder ,getAllOrders,getOrderStatus,updateStatus } = require("../controllers/order");

//params
router.param("/userId", getUserById);
router.param("/orderId", getOrderId);

//routers
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);

router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);

router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)

router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router;
