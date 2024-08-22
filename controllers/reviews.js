const Review=require("../models/review.js");
const MainListingdata=require("../models/listing.js");
module.exports.createReviews=async (req,res)=>{
    console.log(req.params.id);
    let listing=await MainListingdata.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
     listing.reviews.push(newReview);
      await newReview.save()
      await listing.save();
      req.flash("success","New Review Created");
     res.redirect(`/listing/${req.params.id}`);

}
module.exports.DestroyReviews=async(req,res)=>{
    let {id,reviewId}=req.params;
    await MainListingdata.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    console.log(id);
    res.redirect(`/listing/${id}`);
    
    }