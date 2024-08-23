const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserControllers=require("../controllers/users.js");

router.route("/signup")
.get(UserControllers.RanderSignupForm)
.post(wrapAsync(UserControllers.signup))

// login rout
router.route("/login")
.get(UserControllers.RanderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true}),
 UserControllers.Login);

// logout
router.get("/logout",UserControllers.Logout);
//router exports

module.exports=router;