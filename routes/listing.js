const express=require("express");
const router=express.Router();
const wrapAsync=require("../utills/wrapAsync.js");
const MainListingdata=require("../models/listing.js");
const {toLogedIn,isOwner,validateListing}=require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
// main schema error handler middleware 
router.get("/",wrapAsync(listingControllers.index));
// new add rout
router.get("/new",toLogedIn,listingControllers.randerNewForm);

// post add
router.post("/add",toLogedIn,validateListing,wrapAsync(listingControllers.createListing));

//show rout
router.get("/:id",wrapAsync(listingControllers.showListing));

// upadate list
router.get("/:id/edit",toLogedIn,isOwner,wrapAsync(listingControllers.EditForm));


// put Edit
router.put("/:id",toLogedIn,isOwner,validateListing,wrapAsync(listingControllers.putEditForm));

// delete rout
router.delete("/:id",toLogedIn,isOwner,wrapAsync(listingControllers.destroyListing));

module.exports=router;