const mongoose=require("mongoose");
const Mongo_url='mongodb://127.0.0.1:27017/PlecementProject1';
const MainListingdata=require("../models/listing.js");
const initData=require("./data.js");
main().then(()=>{
    console.log("connection successfull !");

}).catch(()=>{
    console.log("connection unsucessfull !");
})
async function main(){
    mongoose.connect(Mongo_url);
}
async function init(){
    await MainListingdata.deleteMany({});
    await MainListingdata.insertMany(initData.data).then((d)=>{
        console.log(d);

    });
}
init();