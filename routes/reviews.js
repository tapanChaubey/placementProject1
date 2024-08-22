const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utills/wrapAsync.js");
const ExpressError=require("../utills/ExpressError.js");
const {validateReview,toLogedIn,isReviewAuthor}=require("../middleware.js");
const ReviewControllers=require("../controllers/reviews.js")
// error handler
//
router.post("/",toLogedIn,validateReview,wrapAsync(ReviewControllers.createReviews))
// delete reviews rout
router.delete("/:reviewId",toLogedIn,isReviewAuthor,wrapAsync(ReviewControllers.DestroyReviews))

module.exports=router;