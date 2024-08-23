const express=require("express");
const router=express.Router();
const wrapAsync=require("../utills/wrapAsync.js");
const MainListingdata=require("../models/listing.js");
const {toLogedIn,isOwner,validateListing}=require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudeConfig.js");
let upload=multer({storage})
// main schema error handler middleware 
router.route("/").get(wrapAsync(listingControllers.index));
// post add 
// post add
router.post("/add",toLogedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.createListing));
// router.post("/add",toLogedIn,upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });
// new rout
router.get("/new",toLogedIn,listingControllers.randerNewForm);

///:id router.route
router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(toLogedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.putEditForm))
.delete(toLogedIn,isOwner,wrapAsync(listingControllers.destroyListing));


//show rout
// router.get("/:id",wrapAsync(listingControllers.showListing));

// upadate list
router.get("/:id/edit",toLogedIn,isOwner,wrapAsync(listingControllers.EditForm));


// put Edit
// router.put("/:id",toLogedIn,isOwner,validateListing,wrapAsync(listingControllers.putEditForm));

// delete rout
// router.delete("/:id",toLogedIn,isOwner,wrapAsync(listingControllers.destroyListing));

module.exports=router;