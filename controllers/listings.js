const MainListingdata=require("../models/listing.js");
module.exports.index=async(req,res)=>{
    const allListings=await MainListingdata.find({});
    res.render("./Listing/index.ejs",{allListings});
}

module.exports.randerNewForm=(req,res)=>{
    res.render("./Listing/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{ 
    let listing=req.body.listing;
    const newList=new MainListingdata(listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
}

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  if(!allListings){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listing");
  }
  console.log(allListings);
  res.render("./Listing/show.ejs",{allListings}); 
}

module.exports.EditForm=async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  if(!allListings){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listing");
  }
  res.render("./Listing/edit.ejs",{allListings}); 
}
module.exports.putEditForm=async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","New Listing Updated !");
    res.redirect("/listing");
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
    res.redirect("/listing")
}