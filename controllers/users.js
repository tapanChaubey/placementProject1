const User=require("../models/user.js");

module.exports.RanderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
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
   
};

module.exports.RanderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome To WanderLust");
    let redirectUrl1=res.locals.redirectUrl||"/listing";
    res.redirect(redirectUrl1);
};
module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listing");
    })
}