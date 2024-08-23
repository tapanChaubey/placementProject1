const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }]
})
Schema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}}); 
    }
})
const MainListingdata=mongoose.model("MainListingdata",Schema);
module.exports=MainListingdata;
