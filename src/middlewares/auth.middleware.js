const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const user = require("../models/user.model");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new apiError(401, "Unauthorized access");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token");
  }
});

module.exports = verifyJWT;
