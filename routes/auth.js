var express = require('express')
var router = express.Router()
const {check , validateResult} = require("express-validator")
const {signup,signin,signout} = require("../controllers/auth")

router.post("/signup",
    [
        check("name","name should be atleast 3 charecters").isLength({min:3}),
        check("email","email is required").isEmail(),
        check("password","password is required and minimum length 3").isLength({min:3})
    ]
,signup)

router.post("/signin",
    [
        check("email","email is required").isEmail(),
        check("password","password must be atleast  charecters").isLength({min:3}),
    ]
,signin)

router.get("/signout",signout)

module.exports = router;