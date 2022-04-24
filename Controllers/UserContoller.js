const bcrypt = require("bcrypt");
const _ = require("lodash");

const asyncHandler = require('../Middleware/async')


const User = require("../models/User");
const OtpModel = require("../models/OtpverificationModel");

const SmsSender = require("../Utils/SmsSender");
const OtpGenerator = require("../Utils/OtpGenerator");

module.exports.signUp =asyncHandler( async (req, res) => {

  if (!req.body.number|| !req.body.address || !req.body.name || !req.body.address|| !req.body.email){
    res.send({message:"name email address and pincode required"})
  }
  else{
  const user = await User.findOne({
    number: req.body.number,
    name:req.body.name,
    address:req.body.address,
    pincode:req.body.pincode,
    email:req.body.email

  });

  if (user) return res.status(400).send("UserAlredy Registerd");

  else{

  const OTP =OtpGenerator()
  const number = req.body.number;
  const message = `Your OTP is ${OTP}`;

  SmsSender(message, req.body.number);

  const otp = new OtpModel({ number: number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  const userDetails = await User.create(req.body);
  return res.status(200).send({message:"Otp sent successfully And Data has been saved",OTP:OTP,status:200,
error:false,success:true});}

}});

// Login Module
// @post : localhost:8080/api/user/login/verify

module.exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });

  if (user) {
    const OTP = OtpGenerator()
    const number = req.body.number;

    const message = `Your OTP is ${OTP}`;

    SmsSender(message, req.body.number);

    const otp = new OtpModel({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send({
      status:200,
       data:res.data,
      success: true,
      error:false,
      OTP: OTP,
    message:"Signin/Login successful" } );
  } else {
    return res.status(400).send({  
      status:400,
      data:res.data,
      success: false,
      error:true,
    message:"Please Signup" });
  }
});

// Verify OTP For Signup /Login
// @post : localhost:8080/api/user/signup/verify

module.exports.veryFyOtp = asyncHandler(async (req, res) => {
  const otpSaved = await OtpModel.find({
    number: req.body.number,
  });

  if (otpSaved.length === 0) return res.status(400).send("Otp Expired/ Invalid OTP");

  const lastOtpGot = otpSaved[otpSaved.length - 1];

  const valid = await bcrypt.compare(req.body.otp, lastOtpGot.otp);

  if (lastOtpGot.number == req.body.number && valid) {
    const user = new User(_.pick(req.body, ["number","address","name","pincode","email"]));  
    const token = user.generateJWT();
    const result = await user.save();
    const OTPdelete = await OtpModel.deleteMany({
      number: lastOtpGot.number,
    });
    return res
      .status(200)
      .send({ status:200,
        data:res.data,
        success: true,
        error:false,
        data: user,
      message:"Signin/Login successful" });
  } else {
    return res.status(400).send({
      status:400,
      error:true,
      message:"Wrong/ExpireOtp"
    });
  }
});

//      Get single user
//   GET /users/:id

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    res.status(200).json({
      status:200,
      data:res.data,
      error:false,
      success: true,
      data: user
    });
  });

  //     Update user
//    PUT /api/users/:id

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status:200,
      data:res.data,
      success: true,
      error:false,
      data: user
    });
  });


//    Add new Address

exports.updateAddress = asyncHandler(async(req,res,next)=>{
    const url = req.params.id
    const willBePush = { address: req.body.address }
    const filter = {url}
    const user = await User.findOneAndUpdate(filter, {
       $push: willBePush,
      });
    
      res.status(200).json({
        status:200,
      data:res.data,
      success: true,
      error:false,
      data: user
      });
    });

  //       Delete user
  //     DELETE /api/users/:id
  
  exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      status:200,
      data:res.data,
      success: true,
      error:false,
      data: user
    });
  });
  


