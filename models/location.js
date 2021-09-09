var mongoose = require('mongoose');
var locationSchema = mongoose.Schema({

    address: {
        type: String
    },
    lat: {
        type: String
    },
    long: {
        type: String
    }, 
       
});

module.exports = mongoose.model('Location', locationSchema);