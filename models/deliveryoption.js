const mongoose = require("mongoose");
const optionSchema = mongoose.Schema({

    optionName:{
        type : String,
    },
    icon:{
        type : String,
    },
    charges:{
        type : String,
    }
});

module.exports = mongoose.model('delivery', optionSchema)