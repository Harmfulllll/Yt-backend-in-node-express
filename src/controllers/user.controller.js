const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const user = require("../models/user.model.js");
const upload = require("../middlewares/multer.middleware.js");
const cloudinary = require("../utils/cloudinary.js");

const register = asyncHandler(async (req, res, next) => {
  const { username, email, fullname, password } = req.body;
  if (
    [username, email, fullname, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new apiError('400, "All fields are mandatory to fill"');
  }
  const userExists = user.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new apiError("409", "User already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }
  const avatarUpload = await cloudinary(avatarLocalPath);
  const coverUpload = await cloudinary(coverLocalPath);

  const Saveduser = await user.create({
    fullname: fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username,
  });
});
/* const createdUser = await user
  .findById(Saveduser._id)
  .select("-password -refreshToken"); */
module.exports = register;
