const mongoose = require("mongoose");
const Schema = mongoose.Schema


const  OtpSchema = new Schema({
    number:String,
    otp:String,
    createdAt:{type:Date,default:Date.now,index:{expires:333}}

},{timestamps:true})

const  OtpModel = mongoose.model(
    "OtpModel",
    OtpSchema
)

module.exports = OtpModel