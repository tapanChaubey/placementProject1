const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require("path");
const fs=require("fs");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const app=express();
const ExpressError=require("./utills/ExpressError.js");
const Mongo_url='mongodb://127.0.0.1:27017/PlecementProject1';
const listing=require("./routes/listing.js");
const reviews1=require("./routes/reviews.js");
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


// listing rout 
app.use("/listing",listing);

//add reviews rout
app.use("/",reviews1);

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