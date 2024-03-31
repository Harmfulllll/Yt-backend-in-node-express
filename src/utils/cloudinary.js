const cloudinary = require("cloudinary").v2;
const { LOADIPHLPAPI } = require("dns");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    return await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = uploadFile;
