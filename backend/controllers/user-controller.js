const User = require("../models/UserSchema");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary,destroyFromCloudinary } = require("../helpers/cloudinaryHelpers");
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phoneNo,
      address,
      citizenshipCardNO,
      skills,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
    } = req.body;
    const { file } = req;
    //user can skip profile picture

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(201).json({
        success: false,
        message: "user already exist!",
      });
    }
    let profilePicture = "";
    let publicId = "";
    if (file) {
      const { url, publicId: uploadedPublicId } = await uploadToCloudinary(file.path);
      profilePicture = url;
      publicId = uploadedPublicId;
      console.log(profilePicture, publicId);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      phoneNo,
      address,
      citizenshipCardNO,
      skills,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
      profilePicture,
      publicId,
    });
    

    return res.status(201).json({
      success: true,
      message: "user registered successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error!",
    });
  }
};
const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(201).json({
                success:false,
                message:"user not found!"
            })
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(201).json({
                success:false,
                message:"invalid password!"
            })
        }
        const token=jsonwebtoken.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"3h"});
        return res.status(201).json({
            success:true,
            message:"user logged in successfully!",
            token,
            user:{
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                role:user.role,
                profilePicture:user.profilePicture
                 }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"

        })
    }
}
const getUserProfile=async(req,res)=>{
  try{
    const userId=req.userInfo.id;
    const user=await User.findById(userId).select("-password -publicId -__v");
    if(!user){
      return res.status(201).json({
        success:false,
        message:"user not found!"
      })
    }
    return res.status(201).json({
      success:true,
      message:"user profile fetched successfully!",
      user
    })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"internal server error!"
    })
  }
}
const getUserProfileById=async(req,res)=>{
  try{
    const userId=req.params.id;
    const user=await User.findById(userId).select("-password -publicId -__v");
    if(!user){
      return res.status(201).json({
        success:false,
        message:"user not found!"
      })
    }
    return res.status(201).json({
      success:true,
      message:"user profile fetched successfully!",
      user
    })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"internal server error!"
    })
  }
}
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    // Only allow updating certain fields
    const allowedFields = [
      "fullName",
      "phoneNo",
      "address",
      "skills",
      "emergencyContactName",
      "emergencyContactRelation",
      "emergencyContactPhone",
      "profilePicture",
      "facebookLink",
      "instagramLink",
      "linkedinLink"
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    const { file } = req;

    // If a new profile picture is uploaded via multer
    if (file) {
      // Get the current user to get the old publicId
      const currentUser = await User.findById(userId);
      if (currentUser && currentUser.publicId) {
        // Destroy old profile picture from Cloudinary
        await destroyFromCloudinary(currentUser.publicId);
      }
      // Upload new profile picture
      const { url, publicId: uploadedPublicId } = await uploadToCloudinary(file.path);
      updates.profilePicture = url;
      updates.publicId = uploadedPublicId;
      console.log(url, uploadedPublicId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, select: "-password -publicId -__v" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
}

module.exports = {
  register,
  login
  ,getUserProfile,
  getUserProfileById,
  updateUserProfile
};
