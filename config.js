// require("dotenv").config();
// const mongoose = require("mongoose");

// mongoose.connect(process.env.HOST, {
//     // useNewUrlParser : true,
//     // useUnifiedTopology : true,
//     // useFindAndModify: false,
//     // useCreateIndex: true,
//   });
  
//   mongoose.connection
//     .once("open", () => console.log("DB Connected..."))
//     .on("error", (error) => {
//       console.log("Error While Connecting With DB");
//     });
  
//   module.exports = { mongoose };


const mongoose = require("mongoose");
const MongoClient = require("mongodb");
mongoose.connect("mongodb+srv://Admin:8128840245@cluster0.o7d7n.mongodb.net/pratha",{
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
    // useFindAndModify: false,
    // useCreateIndex: true,
}).then (() => {
    console.log("connection successfull");

}).catch((err) => {
    console.log("no connection");
})
    
module.exports = { mongoose };
