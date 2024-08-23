const MainListingdata=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient =  mbxGeocoding({ accessToken:mapToken });
module.exports.index=async(req,res)=>{
    const allListings=await MainListingdata.find({});
    res.render("./Listing/index.ejs",{allListings});
}

module.exports.randerNewForm=(req,res)=>{
    res.render("./Listing/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{ 
 let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send()
    
  let url=req.file.path;
  let filename=req.file.filename;
  //console.log(req.file);
  let listing=req.body.listing;
    const newList=new MainListingdata(listing);
    newList.owner=req.user._id;
    newList.image={url,filename};
    newList.geometry=response.body.features[0].geometry;
   let savedList= await newList.save();
   console.log(savedList);
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
  //console.log(allListings);
  res.render("./Listing/show.ejs",{allListings}); 
}

module.exports.EditForm=async(req,res)=>{
    const {id}=req.params;
  let allListings=await MainListingdata.findById(id);
  if(!allListings){
    req.flash("error","Listing you requested does not exist !");
    res.redirect("/listing");
  }
  let originalImage=allListings.image.url;
 originalImage=originalImage.replace("/upload","/upload/w_250");
  res.render("./Listing/edit.ejs",{allListings,originalImage}); 
}
module.exports.putEditForm=async(req,res)=>{
    let {id}=req.params;
   let listing1= await MainListingdata.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !=="undefined"){
    let url=req.file.path;
   let filename=req.file.filename;
   listing1.image={url,filename};
    await listing1.save();
   }
    req.flash("success","New Listing Updated !");
    res.redirect("/listing");
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await MainListingdata.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
    res.redirect("/listing")
}