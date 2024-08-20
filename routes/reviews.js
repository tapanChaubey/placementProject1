const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utills/wrapAsync.js");
const ExpressError=require("../utills/ExpressError.js");
const {validateReview}=require("../middleware.js");
const MainListingdata=require("../models/listing.js");
const Review=require("../models/review.js");
// error handler
//
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    console.log(req.params.id);
    let listing=await MainListingdata.findById(req.params.id);
    let newReview=new Review(req.body.review);
     listing.reviews.push(newReview);
      await newReview.save()
      await listing.save();
      req.flash("success","New Review Created");
     res.redirect(`/listing/${req.params.id}`);

}))
// delete reviews rout
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;
await MainListingdata.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success","Review is Deleted");
res.redirect(`/listing/${id}`);

}))

module.exports=router;