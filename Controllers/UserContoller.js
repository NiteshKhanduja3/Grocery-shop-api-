const bcrypt = require("bcrypt");
const _ = require("lodash");

const asyncHandler = require('../Middleware/async')


const User = require("../models/User");
const OtpModel = require("../models/OtpverificationModel");

const SmsSender = require("../Utils/SmsSender");
const OtpGenerator = require("../Utils/OtpGenerator");

module.exports.signUp = async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });

  if (user) return res.status(400).send("UserAlredy Registerd");
  const OTP =OtpGenerator()
  const number = req.body.number;

  console.log(OTP);

  const message = `Your OTP is ${OTP}`;

  SmsSender(message, req.body.number);

  const otp = new OtpModel({ number: number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  const userDetails = await User.create(req.body);
  return res.status(200).send({message:"Otp sent successfully And Data has been saved"});

};

// Login Module
// @post : localhost:8080/api/user/login/verify

module.exports.login = async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });

  if (user) {
    const OTP = OtpGenerator()
    const number = req.body.number;

    console.log(OTP);

    const message = `Your OTP is ${OTP}`;

    SmsSender(message, req.body.number);

    const otp = new OtpModel({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp sent succfully");
  } else {
    return res.status(400).send({ message: "Please Signup" });
  }
};

// Verify OTP For Signup /Login
// @post : localhost:8080/api/user/signup/verify

module.exports.veryFyOtp = async (req, res) => {
  const otpSaved = await OtpModel.find({
    number: req.body.number,
  });
  if (otpSaved.length === 0) return res.status(400).send("Otp Expired");

  const lastOtpGot = otpSaved[otpSaved.length - 1];

  const valid = await bcrypt.compare(req.body.otp, lastOtpGot.otp);

  if (lastOtpGot.number == req.body.number && valid) {
    const user = new User(_.pick(req.body, ["number"]));
    const token = user.generateJWT();
    const result = await user.save();
    const OTPdelete = await OtpModel.deleteMany({
      number: lastOtpGot.number,
    });
    return res
      .status(200)
      .send({ message: "UserRegested / Signin successfully", token: token });
  } else {
    return res.status(400).send("wrong otp");
  }
};

//      Get single user
//   GET /users/:id

exports.getUser = asyncHandler(async (req, res, next) => {
    console.log("parmas",req.params.id)
    const user = await User.findById(req.params.id);
  
    res.status(200).json({
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
      success: true,
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
        success: true,
        data: user
      });
    });

  //       Delete user
  //     DELETE /api/users/:id
  
  exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });
  


