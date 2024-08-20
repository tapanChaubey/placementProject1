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
        type:String,
       // default:"https://www.istockphoto.com/photo/young-woman-riding-bicycle-on-wooden-pier-in-the-maldives-gm1298306226-391188431?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhotel-image&utm_medium=affiliate&utm_source=unsplash&utm_term=hotel+image%3A%3A%3A",
        set:(v)=>v==" " ? "https://www.istockphoto.com/photo/young-woman-riding-bicycle-on-wooden-pier-in-the-maldives-gm1298306226-391188431?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhotel-image&utm_medium=affiliate&utm_source=unsplash&utm_term=hotel+image%3A%3A%3A":v,
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
