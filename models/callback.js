const mongoose = require("mongoose")
const callbackSchema = mongoose.Schema({

    name: {
        type : String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
        //type : String
    },
    mobileNo: {
        type: String
    },
    status: {
        type: String,
        default: "PENDING"
    }

})

module.exports = mongoose.model('callback', callbackSchema)