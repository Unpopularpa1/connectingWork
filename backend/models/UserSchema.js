const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["worker", "hirer", "both", "admin"],
      default: "worker",
      reqired: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    citizenshipCardNO: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    emergencyContactName: {
      type: String,
      required: true,
    },
    emergencyContactRelation: {
      type: String,
      required: true,
    },
    emergencyContactPhone: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
  },
  facebookLink:{
    type:String,
    default:"",
  },
  instagramLink:{
    type:String,
    default:"",
  },
  linkedinLink:{
    type:String,
    default:"",
  },
  
   
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
