if(process.env.NODE_ENV!='production'){
    require('dotenv').config();

}
console.log(process.env.secret);
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require("path");
const fs=require("fs");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require("express-session");
const flash=require("connect-flash");
const app=express();
const ExpressError=require("./utills/ExpressError.js");
const Mongo_url='mongodb://127.0.0.1:27017/PlecementProject1';
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const sessionOption={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
main().then(()=>{
    console.log("connection successfull !");

}).catch(()=>{
    console.log("connection unsucessfull !");
})
async function main(){
    mongoose.connect(Mongo_url);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrUser=req.user;
    next();
})
// listing rout 
app.use("/listing",listingRouter);
//add reviews rout
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"));

})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="somethink went worng !"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
})

app.listen(8080,(err)=>{
    if(err){
        console.log("server does not started !")
    }
    else{
        console.log("server started at 8080 !");
    }
})