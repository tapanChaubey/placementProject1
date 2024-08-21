const express=require("express");
const router=express.Router();
const wrapAsync=require("../utills/wrapAsync.js");
const MainListingdata=require("../models/listing.js");
const {toLogedIn,isOwner,validateListing}=require("../middleware.js");
// main schema error handler middleware 
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await MainListingdata.find({});
    res.render("./Listing/index.ejs",{allListings});
}))
// new add rout
router.get("/new",toLogedIn,(req,res)=>{
    res.render("./Listing/new.ejs");
})
router.post("/add",toLogedIn,validateListing,wrapAsync(async (req,res,next)=>{ 
    let listing=req.body.listing;
    const newList=new MainListingdata(listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
}));

//show rout
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  if(!allListings){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listing");
  }
  console.log(allListings);
  res.render("./Listing/show.ejs",{allListings}); 
}));
// upadate list
router.get("/:id/edit",toLogedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  if(!allListings){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listing");
  }
  res.render("./Listing/edit.ejs",{allListings}); 
}));
router.put("/:id",toLogedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","New Listing Updated !");
    res.redirect("/listing");
}));
// delete rout
router.delete("/:id",toLogedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
    res.redirect("/listing")
}));
module.exports=router;