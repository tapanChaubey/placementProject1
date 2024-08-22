const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserControllers=require("../controllers/users.js");

router.get("/signup",UserControllers.RanderSignupForm);
// signUp
router.post("/signup",wrapAsync(UserControllers.signup));
//
router.get("/login",UserControllers.RanderLoginForm);
/// login post

router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true}),
 UserControllers.Login);

// logout
router.get("/logout",UserControllers.Logout);
//router exports

module.exports=router;