const express=require("express");
const router=express.Router();
const wrapAsync=require("../utills/wrapAsync.js");
const ExpressError=require("../utills/ExpressError.js");
const {listinSchema}=require("../schema.js");
const MainListingdata=require("../models/listing.js");
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

router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await MainListingdata.find({});
    res.render("./Listing/index.ejs",{allListings});
}))
// new add rout
router.get("/new",(req,res)=>{
    res.render("./Listing/new.ejs");
})
router.post("/add",validateListing,wrapAsync(async (req,res,next)=>{ 
    let listing=req.body.listing;
    const newList=new MainListingdata(listing);
    await newList.save();
    res.redirect("/listing");
}));

//show rout
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id).populate("reviews");
  res.render("./Listing/show.ejs",{allListings}); 
}));
// upadate list
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  res.render("./Listing/edit.ejs",{allListings}); 
}));
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
}));
// delete rout
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndDelete(id);
    res.redirect("/listing")
}));
module.exports=router;