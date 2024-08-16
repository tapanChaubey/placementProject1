const express=require("express");
const router=express.Router();
const wrapAsync=require("../utills/wrapAsync.js");
const ExpressError=require("../utills/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const MainListingdata=require("../models/listing.js");
const Review=require("../models/review.js");

// error handler
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

//
router.post("/listing/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await MainListingdata.findById(req.params.id);
    let newReview=new Review(req.body.review);
     listing.reviews.push(newReview);
      await newReview.save()
      await listing.save();
     res.redirect(`/listing/${req.params.id}`);

}))
// delete reviews rout
router.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;
await MainListingdata.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listing/${id}`);

}))

module.exports=router;