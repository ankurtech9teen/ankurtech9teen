const mongoose = require("mongoose");
const customerSchema =  mongoose.Schema({

    name:{
        type : String,
    },
    mobileNo :{
        type : String,
    },
    email:{
        type : String,
    },
    profilePic:{
        type : String,
        default : ""
    },
    referalCoad:{
        type : String,
    },
    deviceType:{
        type : String,
    },
    playerId:{
        type : String,
    }
});

 module.exports = mongoose.model('signup',customerSchema)