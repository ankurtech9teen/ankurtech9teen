const mongoose = require('mongoose');
const multer = require('multer');
var express = require('express');
var router = express.Router();
var MongoClient = require('../config');

var customerSchema = require('../models/sign');
var optionSchema = require('../models/deliveryoption');
var contactusSchema = require('../models/contactus');
var callbackSchema = require('../models/callback');
var locationSchema = require('../models/location');


const { response, route } = require('../app');

const sign = require('../models/sign');
const deliveryoption = require('../models/deliveryoption');
const contactus = require('../models/contactus');
const callback = require('../models/callback');
const location = require('../models/location');
const { create, syncIndexes, aggregate } = require('../models/sign');

//const { create, syncIndexes, aggregate } = require('../models/deliveryoption');
//const { create, syncIndexes, aggregate } = require('../models/contactus');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

var icon = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, "uploads/picture");
  },
  filename: function(req, file, cb){
      cb(null, Date.now() + "_" + file.originalname);
  }
});

var profilePic = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, "uploads/picture");
  },
  filename: function(req, file, cb){
      cb(null, Date.now() + "_" + file.originalname);
  }
});


var uploaddelivery = multer({storage: icon});
var uploadSign = multer({storage: profilePic});

//signup insert api-------------------------------------------------------------------28-08-2021
router.post("/signup", uploadSign.single('profilePic'), async function(req, res){
  const { name, mobileNo, email, referalCoad, deviceType, playerId } = req.body;  
  let fileinfo = req.file;
  try{
    let existMember = await  customerSchema.find({ mobileNo: mobileNo });
    console.log(existMember);
    let exitMember = await  customerSchema.find({ email: email });
    console.log(exitMember);
    if(existMember.length > 0){
      res.status(200).json({ IsSuccess: true, Data: [], Message: "Mobile number already exist !" }); 
    }else if
      (exitMember.length > 0){
        res.status(200).json({ IsSuccess: true, Data: [], Message: "This mail already exist !" });
    }
    else{
      const addMember = await new customerSchema({
        
        name : name,
        mobileNo : mobileNo,
        email : email,
        profilePic :  fileinfo != undefined ? fileinfo.path : "",
        referalCoad : referalCoad,
        deviceType : deviceType,
        playerId : playerId
        
      });
      if(addMember != null){
        addMember.save();
        res.status(200).json({ IsSuccess: true, Data: addMember, Message: "success" });
      }
    }
  }catch(error){
    res.status(500).json({ IsSuccess: false,Message: error.message });
  }
});

//sign update api------------------------------------------------------------------28-08-2021
router.post('/signupdate', uploadSign.single('profilePic'), async function(req,res){
  const { userId, name, mobileNo, email, profilePic, referalCoad, deviceType, playerId } = req.body;
  let fileinfo = req.file;
  try{
      let existUser = await customerSchema.aggregate([
        {
            $match:{
              _id: mongoose.Types.ObjectId(userId)
            }
        }
      ]);
      if(existUser.length > 0){
        let update = {
          // name:name!=undefined||name==""||name!=null?name:existUser[0].name,
          // email:email!=undefined||email==""||email!=null?email:existUser[0].email,
          // phone:phone!=undefined||phone!=null||phone==""?phone:existUser[0].name,
          // address:address!=undefined||address==""||address!=null?address:existUser[0].name,

          name: name!= undefined ? name : existUser[0].name,
          mobileNo: mobileNo!=undefined ? mobileNo:existUser[0].mobileNo,
          email: email!=undefined ? email : existUser[0].email,
          profilePic: fileinfo!=undefined ? fileinfo.path : existUser[0].profilePic,
          referalCoad: referalCoad!=undefined ? referalCoad:existUser[0].referalCoad,
          deviceType: deviceType!=undefined ? deviceType:existUser[0].deviceType,
          playerId: playerId!=undefined ? playerId:existUser[0].playerId,
        
        }
      let updateUser = await customerSchema.findByIdAndUpdate(userId,update);
      }
  } catch (error){
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }

  try{
    const{ userId } = req.body;
    let existUser = await customerSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(userId) 
        }
      }
    ]);
    if(existUser.length > 0){
      res.status(200).json({ IsSuccess:true, Data: existUser, Message: "Updated Successfully!"});
    }else{
      res.status(200).json({ IsSuccess:true, Data: [], Message: "Data Not Found"});
    }
  }
  catch(error){
     res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});

 

//sign delete api------------------------------------------------------------------28-08-2021
router.post('/signdelete',async function(req,res){
  try{
    const{ customerId } = req.body;
    let existUser = await customerSchema.aggregate([
      {
        $match : {
          _id: mongoose.Types.ObjectId(customerId)
        }
      }
    ]);
    if(existUser.length > 0){
      let deleteUser = await customerSchema.findByIdAndDelete(customerId);

      res.status(200).json({ IsSuccess : true, Data : [], Message : "Delete Successfull !!" });     
    }else{
      res.status(200).json({ IsSuccess : false, Data : [], Message : "User Not Found" });
    }
  }catch(error){
    //res.send(err);
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
  
}); 

//sign view api------------------------------------------------------------------28-08-2021
router.post('/signmatch', async function(req,res){
  try{
    const{ userId } = req.body;
    let getUser = await customerSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(userId) 
        }
      }
    ]);
    if(getUser.length > 0){
      res.status(200).json({ IsSuccess:true, Data: getUser, Message: "Data Found !"});
    }else{
      res.status(200).json({ IsSuccess:false, Data: [], Message: "Data Not Found !"});
    }
  } catch(error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});


//login insert api---------------------------------------------------------------28-08-2021
router.post("/login", async function(req,res){
  try{
    const { mobileNo } = req.body;   
    const getUser = await customerSchema.aggregate([
       {
         $match:{mobileNo: mobileNo}
       }
    ]);
    if(getUser.length > 0){
      return res.status(200).json({ "IsSuccess":true, Data :getUser, Message :"Customer Logged in Successfully"});
    }
    else{
      return res.status(200).json({ Data :[], IsSuccess : false, Message :"Customer Not Found"});
    }
  }catch(error){
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});

//login update api------------------------------------------------------------------28-08-2021
router.post('/loginupdate', async function(req,res){
  try{
      const { customerId, mobileNo } = req.body;
      let existUser = await customerSchema.aggregate([
        {
            $match:{
              _id: mongoose.Types.ObjectId(customerId)
            }
        }
      ]);
      if(existUser.length > 0){
        let update = {

          mobileNo: mobileNo!=undefined ? mobileNo:existUser[0].mobileNo,
        }

        let updateUser = await customerSchema.findByIdAndUpdate(customerId,update);
      }
    }catch(err){
      res.send(err);
    }
  try{
    const{ customerId } = req.body;
    let existUser = await customerSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(customerId) 
        }
      }
    ]);
    if(existUser.length > 0){
      return res.status(200).json({ IsSuccess:true, Data: existUser, Message: "Update Successfully !"});
    }
  }
  catch(error){
     res.status(500).json({ IsSuccess: false, Message: error.message});
  }
}); 

//login delete api------------------------------------------------------------------28-08-2021
router.post('/logindelete',async function(req,res){
  try{
    const{ customerId } = req.body;
    let existUser = await customerSchema.aggregate([
      {
      $match : {
        _id: mongoose.Types.ObjectId(customerId)
      }
      }
    ]);
    if(existUser.length > 0){
      let deleteUser = await customerSchema.findByIdAndDelete(_id);

      return res.status(200).json({ IsSuccess: true, Data: [],  Message: "Delete Successfull !!" });
    }else{
      return res.status(200).json({ IsSuccess: false, Data: [], Message: "User Not Found" });
    }
  }catch(error){
    res.status(500).json({ IsSuccess: false, Message: error.message });
  }
}); 

//login view api------------------------------------------------------------------28-08-2021
router.post('/loginmatch', async function(req,res){
  try{
    const{ customerId } = req.body;
    let getUser = await customerSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(customerId) 
        }
      }
    ]);
    if(getUser.length > 0){
      res.status(200).json({ IsSuccess:true, Data: getUser, Message: "Data Found !"});
    }else{
      res.status(200).json({ IsSuccess:true, Data: getUser, Message: "Data Not found !"});
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});


//deliveryoption insert api-------------------------------------------------------------01-09-2021

// router.post("/addOption",uploadDeliveries.single('icon'), async function(req, res, next){
//   const { optionName, icon, charges } = req.body;  
//   const fileinfo = req.file;
//   try{
//     const addOption = await new optionSchema({
//       optionName : optionName,
//       icon : fileinfo == undefined ? "" : fileinfo.path,
//       charges : charges,
//     });
//     if(addOption != null){
//       addOption.save();
//       res.status(200).json({ IsSuccess: true, Data: [addOption], Message: "Successful Added !" });
//     }else{
//       res.status(200).json({ IsSuccess: true, Data: [], Message: "Not Added!" });
//     }
    
//   } catch (error) {
//     res.status(500).json({ IsSuccess: false, Message: error.message });
//   }
// });


router.post('/addOption', uploaddelivery.single('icon'), async function(req, res ){
  const{ optionName, charges } = req.body;
  let fileinfo = req.file;
  try {
      let existOption = await optionSchema.aggregate([
          {
              $match: {
                  optionName: optionName
              }
          }
      ]);
      if(existOption.length > 0){
          res.status(200).json({ IsSuccess: true, Data: [], Message: "Already Exists!" });
      }else{
          let addOption = await new optionSchema({
              optionName: optionName,
              icon: fileinfo != undefined ? fileinfo.path : "",
              charges: charges,
          });
          if(addOption != null){
              addOption.save();
              res.status(200).json({ IsSuccess: true, Data: [addOption], Message: "Added!" });
          }
      }
  } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message });
  }
});

// //deliveryoption edit api-------------------------------------------------------------01-09-2021
// router.post('/updateOption', async function(req,res){
//   try{
//       const { optionId, optionName, icon, charges } = req.body;
//       let existOption = await optionSchema.aggregate([
//         {
//             $match:{
//               _id: mongoose.Types.ObjectId(optionId)
//             }
//         }
//       ]);
//       if(existOption.length > 0){
//         let update = {

//           optionName: optionName!=undefined ? optionName:existOption[0].optionName,
//           icon: icon!=undefined ? icon:existOption[0].icon,
//           charges: charges!=undefined ? charges:existOption[0].charges,
//         }

//         let updateOption = await optionSchema.findByIdAndUpdate(optionId,update);    
//         existOption = await optionSchema.aggregate([
//           {
//             $match:{
//               _id: mongoose.Types.ObjectId(optionId) 
//             }
//           }
//         ]);
//         res.status(200).json({ IsSuccess:true, Data: existOption, Message: "Update ..!"});
//     }else{
//       res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
//     }
//   } catch (error) {
//      res.status(500).json({ IsSuccess: false, Message: error.message});
//   }
// }); 


router.post('/updateOption', uploaddelivery.single('icon'), async function(req, res, next){
  const{ optionId, optionName, icon, charges } = req.body;
  let fileinfo = req.file;
  try {
      let existOption = await optionSchema.aggregate([
          {
              $match: {
                  _id: mongoose.Types.ObjectId(optionId)
              }
          }
      ]);
      if(existOption.length == 1){
          let updateIs = {
            optionName: optionName == undefined ? existOption[0].optionName : optionName,
            icon: fileinfo == undefined ? existOption[0].icon : fileinfo.path,
            charges: charges == undefined ? existOption[0].charges : charges,
          }
          let updateOption = await optionSchema.findByIdAndUpdate(optionId, updateIs);
          existOption = await optionSchema.aggregate([
              {
                  $match: {
                      _id: mongoose.Types.ObjectId(optionId)
                  }
              }
          ]);
          res.status(200).json({ IsSuccess: true, Data: existOption, Message: "Updated..!"});
      }else{
          res.status(200).json({ IsSuccess: true, Data: [], Message: "Not Found..!"});
      }
  } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message });
  }
});

//deliveryoption delete api----------------------------------------------------01-09-2021
router.post('/deleteOption' , async function(req,res){
  try{
    const{optionId } = req.body;
    let existOption = await optionSchema.aggregate([
      {
      $match : {
        _id: mongoose.Types.ObjectId(optionId)
      }
      }
    ]);
    if(existOption.length > 0){
        let deleteUser = await optionSchema.findByIdAndDelete(optionId);
        res.status(200).json({ IsSuccess: true, Data: [], Message: "Delete Successfull !!" });
    }else{
        res.status(200).json({ IsSuccess: false, Data: [], Message: "User Not Found" });
    }
  } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message });
  }
}); 

//delivery option view api------------------------------------------------------------------01-09-2021
router.post('/getOption', async function(req,res){
  try{
    const{ optionId } = req.body;
    let getOption = await optionSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(optionId)
        }
      }
    ]);
    if(getOption.length > 0){
      res.status(200).json({ IsSuccess:true, Data: getOption, Message: "data found !"});
    }else{
      res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
    }
  } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});


//contactus insert api-------------------------------------------------------------01-09-2021
router.post("/contactus", async function(req, res, next){
  const { address, contactNo, emailId, facebook, linkedin, twitter, instagram, snapchat, gmail } = req.body;
  try{
    let addContact = await new contactusSchema({
      address : address,
      contactNo : contactNo,
      emailId : emailId,
      facebook : facebook,
      linkedin : linkedin,
      twitter : twitter,
      instagram : instagram,
      snapchat : snapchat,
      gmail : gmail,
    });
    if(addContact != null){
      addContact.save();
       res.status(200).json({ IsSuccess: true, Data: addContact, Message: "Contact Added!" });
    }else{
       res.status(200).json({ IsSuccess: true, Data: [], Message: "Contact Not Added!"})
    }
  } catch (error){
    res.status(500).json({ IsSuccess: false,Message: error.message });
  }
});

//contactus update api-------------------------------------------------------------01-09-2021
router.post('/updateContact', async function(req, res, next){
  const { contactId, address, contactNo, emailId, facebook, linkedin, twitter, instagram, snapchat, gmail } = req.body;
  try{
      let existContact = await contactusSchema.aggregate([
        {
            $match:{
              _id: mongoose.Types.ObjectId(contactId)
            }
        }
      ]);
      if(existContact.length > 0){
        let update = {

          address: address == undefined ? existContact[0].address : address,
          contactNo: contactNo == undefined ? existContact[0].contactNo : contactNo,
          emailId: emailId == undefined ? existContact[0].emailId : emailId,
          facebook: facebook == undefined ? existContact[0].facebook : facebook,
          linkedin: linkedin == undefined ? existContact[0].linkedin : linkedin,
          twitter: twitter == undefined ? existContact[0].twitter : twitter,
          instagram: instagram == undefined ? existContact[0].instagram : instagram,
          snapchat: snapchat == undefined ? existContact[0].snapchat : snapchat,
          gmail: gmail == undefined ? existContact[0].gmail : gmail,
        }

        let updateContact = await contactusSchema.findByIdAndUpdate(contactId, update);
        existContact = await contactusSchema.aggregate([
          {
            $match:{
                _id: mongoose.Types.ObjectId(contactId) 
            }
          }
        ]);
        res.status(200).json({ IsSuccess: true, Data: existContact, Message: "Updated..." });
      } else {
        res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
      }
  } catch(error) {
     res.status(500).json({ IsSuccess: false, Message: error.message});
  }
}); 

//contactus delete api----------------------------------------------------01-09-2021
router.post('/deleteContact' , async function(req, res, next){
  const{ contactId } = req.body;
  try{
    let existContact = await contactusSchema.aggregate([
      {
        $match : {
          _id: mongoose.Types.ObjectId(contactId)
        }
      }
    ]);
    if(existContact.length > 0){
      let deleteContact = await contactusSchema.findByIdAndDelete(contactId);
      res.status(200).json({IsSuccess: true, Data: 1, Message: "Delete Successfull !!"});
    }else{
      res.status(200).json({ IsSuccess: true, Data: 0, Message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message });
  }
}); 


//contactus view api------------------------------------------------------------------01-09-2021
router.post('/getContactUs', async function(req,res){
  try{
    const{ contactId } = req.body;
    let getContact = await contactusSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(contactId) 
        }
      }
    ]);
    if(getContact.length > 0){
      res.status(200).json({ IsSuccess:true, Data: getContact, Message: "Data Found !" });
    }else{
      res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});

// //call-back insert api----------------------------------------------------------01-09-2021


// router.post("/callback", async function (req, res, next){
   
//   try{  
//     const { name, user_Id, mobileNo, status } = req.body;

//     let existMember = await  callbackSchema.find({ mobileNo: mobileNo });
//     console.log(existMember);
    
//     if(existMember.length > 0){
//       res.status(200).json({ IsSuccess: true, Data: [], Message: "Mobile number already exist !" }); 
//     }else{
//       let addcallback = await new callbackSchema({
//           name : name,
//           user_Id : user_Id,
//           mobileNo : mobileNo,
//           status : status,
//       })
//       if(addcallback != null){
//         addcallback.save();
//         res.status(200).json({ IsSuccess: true, Data: addcallback, Message: "Data Successfully Added!" });
//       }else{
//         res.status(500).json({ IsSuccess: true, Data: [], Message: "Data Not Added!" })
//       }
//     } 
//   } catch (error) {
//     res.status(500).json({ IsSuccess: false,Message: error.message });
//   }
// });


router.post('/callback', async function(req, res, next){
  try {
      const { name, userId, mobileNo, status } = req.body;
      let existUser = await customerSchema.aggregate([
           {
               $match: {
                   _id: mongoose.Types.ObjectId(userId)
               }
           }
       ]);
       if(existUser.length > 0){
           let addStatus = await new callbackSchema({
              name : name,
              userId: userId,
              mobileNo: mobileNo,
              status: "PENDING"
          });
          if(addStatus != null){
              addStatus.save();
              res.status(200).json({ IsSuccess: true, Data: addStatus, Message: "Data Added..!"});
          }else{
              res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Added..!"});
          }
      } 
    } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});



//call-back  update api------------------------------------------------01-09-2021
// router.post('/updateCallback', async function(req,res){
//   try{
//       const { callbackId, user_Id, mobileNo, status } = req.body;
//       let existUser = await callbackSchema.aggregate([
//         {
//             $match:{
//               _id: mongoose.Types.ObjectId(callbackId)
//             }
//         }
//       ]);
//       if(existUser.length > 0){
//         let update = {
//             user_Id: user_Id == undefined ? existUser[0].user_Id : user_Id,
//             mobileNo: mobileNo == undefined ? existUser[0].mobileNo : mobileNo,
//             status: status == undefined ? existUser[0].status : status,
//         }

//         let updateUser = await callbackSchema.findByIdAndUpdate(callbackId,update);
//         existUser = await callbackSchema.aggregate([
//           {
//             $match:{
//               _id: mongoose.Types.ObjectId(callbackId) 
//             }
//           }
//         ]);
//         res.status(200).json({ IsSuccess:true, Data: existUser, Message: "Updated.. !"});
//       }else{
//         res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
//       }
//   } catch (error) {
//      res.status(500).json({ IsSuccess: false, Message: error.message});
//   }
// });


// router.post('/updateCallback', async function(req, res, next){
//   const { userId, status } = req.body;
//   try {
//       let existUser = await callbackSchema.aggregate([
//           {
//               $match: {
//                   userId: mongoose.Types.ObjectId(userId)
//               }
//           }
//       ]);
//       if(existUser.length == 1){
//           let updateIs = {
//               status: status == undefined ? existUser[0].status : status,
//           }
//           let updateAddress = await callbackSchema.findByIdAndUpdate(existUser[0]._id, updateIs);
//           res.status(200).json({ IsSuccess: true, Data: 1, Message: "Address updated"});
//       }else{
//           res.status(200).json({ IsSuccess: true, Data: [], Message: "User Not Found"});
//       } 
//   } catch (error) {
//       res.status(500).json({ IsSuccess: false, Message: error.message });
//   }
// });


router.post('/updateStatus', async function(req, res, next){
  const{ callbackId } = req.body;
  try {
      let existOrder = await callbackSchema.aggregate([
          {
              $match: {
                  _id: mongoose.Types.ObjectId(callbackId)
              }
          }
      ]);
      if(existOrder.length == 1){
          let updateIs = {
              status: "SOLVED"
          }
          let updateStatus = await callbackSchema.findByIdAndUpdate(callbackId, updateIs);
          existOrder = await callbackSchema.aggregate([
              {
                  $match: {
                      _id: mongoose.Types.ObjectId(callbackId)
                  }
              }
          ]);
          res.status(200).json({ IsSuccess: true, Data: existOrder, Message: "Data Updated" });
      }else{
          res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
      }
  } catch (error) {
      res.status(500).json({ IsSuccess: false, Message: error.message });
  }
});



//callback delete api----------------------------------------------------01-09-2021
router.post('/callbackdelete' , async function(req,res){
  try{
    const{ callbackId } = req.body;
    let existcallback = await callbackSchema.aggregate([
      {
        $match : { _id: mongoose.Types.ObjectId(callbackId) }
      }
    ]);
    if(existcallback.length > 0){
        let deletecallback = await callbackSchema.findByIdAndDelete(callbackId);
        res.status(200).json({ IsSuccess: true, Data: [], Message: "Delete Successfull !!"});
    }else{
        res.status(200).json({ IsSuccess: false, Data: [], Message: "Data Not Found"});
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message });
  }
}); 


//callback getone user all data api------------------------------------------------------------------01-09-2021
router.post('/callbackmatch', async function(req,res){
  try{
    const{ userId } = req.body;
    let existcallback = await callbackSchema.aggregate([
      {
        $match:{
          userId: mongoose.Types.ObjectId(userId) 
        }
      }
    ]);
    if(existcallback.length > 0){
        res.status(200).json({ IsSuccess:true, Data: existcallback, Message: "Data Found !"});
    }else{
        res.status(200).json({ IsSuccess: false, Data: [], Message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});


//callback getone user data api------------------------------------------------------------------01-09-2021
router.post('/getUserMatch', async function(req,res){
  try{
    const{ userId } = req.body;
    let getUser = await callbackSchema.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(userId) 
        }
      }
    ]);
    if(getUser.length == 1){
        res.status(200).json({ IsSuccess:true, Data: getUser, Message: "Data Found !"});
    }else{
        res.status(200).json({ IsSuccess: false, Data: [], Message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});



// router.post('/getUser', async function(req,res){
//   try{
//     const{ name, userId, mobileNo, status } = req.body;
//     let getUser = await customerSchema.aggregate([
//       {
//         $match:{
//           _id: mongoose.Types.ObjectId(userId) 
//         }
//       }
//     ]);
//     if(getUser.length > 0){
//      // res.status(200).json({ IsSuccess:true, Data: getUser, Message: "Data Found !"});
    
//         let addStatus = await new callbackSchema({
//            name : name,
//            userId: userId,
//            mobileNo: mobileNo,
//            status: "PENDING"
//        });
//        if(addStatus != null){
//            addStatus.save();
//            res.status(200).json({ IsSuccess: true, Data: addStatus, Message: "Data Added..!"});
//        }else{
//            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Added..!"});
//        }
//    } 
//  } catch (error) {
//    res.status(500).json({ IsSuccess: false, Message: error.message });
//  }
// });


//callback getAll api------------------------------------------------------------------01-09-2021
router.post('/callbackall', async function(req,res){
  try{
    let existcallback = await callbackSchema.aggregate([
      {
        $match:{}
      }
    ]);
    if(existcallback.length > 0){
        res.status(200).json({ IsSuccess:true, Data: existcallback, Message: "Data Found !"});
    }else{
        res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false, Message: error.message});
  }
});


//Location insert api-------------------------------------------------------------------07-09-2021
router.post('/addAddress', async function(req, res, next){
  
  try {
        const { address, lat, long } = req.body;
        let addAddress = await new locationSchema({
          address: address,
          lat: lat,
          long: long

        });
        if(addAddress != null){
           addAddress.save();
           res.status(200).json({ IsSuccess: true, Data: addAddress, Message: "Address Added!" });
        }else{
           res.status(200).json({ IsSuccess: true, Data: [], Message: "Address Not Added!"})
        }
      } catch (error){
        res.status(500).json({ IsSuccess: false,Message: error.message });
      }
    });

  
    router.post('/updateAddress', async function(req, res, next){
      const { addressId, address } = req.body;
      try {
          let existUser = await locationSchema.aggregate([
              {
                  $match: {
                      _id: mongoose.Types.ObjectId(addressId)
                  }
              }
          ]);
          if(existUser.length > 0){
              let updateIs = {
                  address: address == undefined ? existUser[0].address : address,
              }
              let updateAddress = await locationSchema.findByIdAndUpdate(addressId, updateIs);
              res.status(200).json({ IsSuccess: true, Data: 1, Message: "Address updated"});
          }else{
              res.status(200).json({ IsSuccess: true, Data: [], Message: "User Not Found"});
          } 
      } catch (error) {
          res.status(500).json({ IsSuccess: false, Message: error.message });
      }
  });
  
  router.post('/deleteAddress', async function(req, res, next){
    const{ addressId } = req.body;
    try {
        let existAddress = await addressSchema.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(addressId)
                }
            }
        ]);
        if(existAddress.length > 0){
            let deleteAddress = await addressSchema.findByIdAndDelete(addressId);
            res.status(200).json({ IsSuccess: true, Data: 1, message: "Address Deleted!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, message: "Address not found!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});


module.exports = router;