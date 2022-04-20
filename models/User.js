const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true
    },
    address: {
      type: [String],
      required:true
    },
    pincode: {
      type: Number,
      required:true
    },
    email: {
      type: String,
      required:true
    },

    number: { type: Number, required: true },
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10d" }
  );
  return token;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
