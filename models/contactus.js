var mongoose = require("mongoose");
var contactusSchema = mongoose.Schema({

    address: {
        type : String
    },
    contactNo: {
        type : String
    },
    emailId: {
        type : String
    },
    facebook: {
        type : String
    },
    linkedin: {
        type : String
    },
    twitter: {
        type : String
    },
    instagram: {
        type : String
    },
    snapchat: {
        type : String
    },
    gmail: {
        type : String
    }
});

module.exports = mongoose.model('contactus', contactusSchema)