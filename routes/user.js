const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync");
const passport=require("passport");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
   let {username,email,password}=req.body;
   let newUser1= new User({email,username});
   let data=await User.register(newUser1,password);
   console.log(data);
   req.flash("success","Welcome To WanderLust !");
   res.redirect("/listing");
    } catch(e){
        req.flash("error","User is Allready register")
        res.redirect("/signup");
    }
   
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true}),
 async(req,res)=>{
req.flash("success","Welcome To WanderLust");
res.redirect("/listing");
})


module.exports=router;