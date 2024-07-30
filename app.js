const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require("path");
const fs=require("fs");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const app=express();
const wrapAsync=require("./utills/wrapAsync.js");
const ExpressError=require("./utills/ExpressError.js");
const Mongo_url='mongodb://127.0.0.1:27017/PlecementProject1';
const {listinSchema}=require("./schema.js");
const MainListingdata=require("./models/listing.js");
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

// main schema error handler middleware 

const validateListing=(req,res,next)=>{
    let {error}=listinSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}
// rout 1
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await MainListingdata.find({});
    res.render("./Listing/index.ejs",{allListings});
}))
// new add rout
app.get("/listing/new",(req,res)=>{
    res.render("./Listing/new.ejs");
})
app.post("/listing/add",validateListing,wrapAsync(async (req,res,next)=>{ 
    let listing=req.body.listing;
    const newList=new MainListingdata(listing);
    await newList.save();
    res.redirect("/listings");
}));

//show rout
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  res.render("./Listing/show.ejs",{allListings}); 
}));
// upadate list
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  res.render("./Listing/edit.ejs",{allListings}); 
}));
app.put("/listing/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));
// delete rout
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndDelete(id);
    res.redirect("/listings")
}));
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