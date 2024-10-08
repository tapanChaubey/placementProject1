const MainListingdata=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utills/ExpressError.js");
const {listinSchema,reviewSchema}=require("./schema.js");
module.exports.toLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create Listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
};
module.exports.isOwner = async(req,res,next) =>{
   let {id}=req.params;
   let Listing=await MainListingdata.findById(id);
   if(!Listing.owner.equals(res.locals.CurrUser._id)){
    req.flash("error","You are not owner of Listing");
   return res.redirect(`/listing/${id}`);
   }
    next();
};
module.exports.validateListing=(req,res,next)=>{
    let {error}=listinSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId}=req.params;
    let reviews1=await Review.findById(reviewId);
    if(!reviews1.author.equals(res.locals.CurrUser._id)){
     req.flash("error","You are not Author of Review");
    return res.redirect(`/listing/${id}`);
    }
     next();
 };