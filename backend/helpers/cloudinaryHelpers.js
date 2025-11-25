const cloudinary = require("../config/cloudinary"); // Import the Cloudinary instance

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Important for handling any file type
    });
    // console.log("File uploaded to Cloudinary:", result);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error while uploading to Cloudinary:", error);
    throw new Error("Error while uploading to Cloudinary");
  }
};
const destroyFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // Assuming profile pictures are images
    });
    return result;
  } catch (error) {
    console.log("Error while deleting from Cloudinary:", error);
    throw new Error("Error while deleting from Cloudinary");
  }
};

module.exports = {
  uploadToCloudinary,
  destroyFromCloudinary
};