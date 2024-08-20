const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
   let {username,email,password}=req.body;
   let newUser1= new User({email,username});
   let RegisterUser=await User.register(newUser1,password);
   console.log(RegisterUser);
   req.login(RegisterUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome To WanderLust !");
    res.redirect("/listing");
   })
    } catch(e){
        req.flash("error","User is Allready register")
        res.redirect("/signup");
    }
   
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true}),
 async(req,res)=>{
req.flash("success","Welcome To WanderLust");
let redirectUrl1=res.locals.redirectUrl||"/listing";
res.redirect(redirectUrl1);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listing");
    })
})

module.exports=router;