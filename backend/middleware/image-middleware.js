const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      // Example output: image-1713456791234.jpg
    );
  },
});

const checkFileFilter = (req, file, cb) => {
  // Check if the uploaded file's mimetype starts with "image"
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Not an image! Please upload only images."), false); // Reject the file
  }
};

module.exports = multer({
  storage: storage, // Use the storage config defined above
  fileFilter: checkFileFilter, // Use custom filter to allow only images
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
  },
});
