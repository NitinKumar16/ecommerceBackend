const express = require("express");
const router = express.Router();

//controller

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory
} = require("../controllers/category");

//models

const Category = require("../models/category");

//params

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//create Router

router.post("/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//read Routers

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update Router

router.put("/category/update/:userId/:categoryId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete Router

router.delete("/category/delete/:userId/:categoryId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
