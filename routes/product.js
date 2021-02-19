const express = require("express");
const router = express.Router();
const multer = require('multer');
const {check , validateResult} = require("express-validator")
const {getProductById,createProduct,getProduct,getAllProducts,updateProduct,deleteProduct,getAllUniqueCategories} = require("../controllers/product")
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")


//params

router.param("userId",getUserById)
router.param("productId",getProductById)

//routers
router.post("/product/create/:userId",isSignedIn,isAdmin,isAuthenticated,createProduct)
router.get("/products",getAllProducts)
router.get("/product/:productId",getProduct)
router.put("/product/update/:userId/:productId",isSignedIn,isAdmin,isAuthenticated,updateProduct)
router.delete("/product/delete/:userId/:productId",isSignedIn,isAdmin,isAuthenticated,deleteProduct)
router.get("/product/categories",getAllUniqueCategories)


module.exports = router;