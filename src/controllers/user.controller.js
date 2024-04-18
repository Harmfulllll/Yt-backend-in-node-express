const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const user = require("../models/user.model.js");
const upload = require("../middlewares/multer.middleware.js");
const cloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/user.route.js");

const saveAccessAndRefreshToken = async (userid) => {
  try {
    const find = await user.findById(userid);
    const accessToken = find.generateAccessToken();
    const refreshToken = find.generateRefreshToken();

    find.refreshToken = refreshToken;
    await find.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong");
  }
};

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

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new apiError(400, "Username or password is required");
  }
  const findUser = await user.findOne({
    $or: [{ username }, { email }],
  });
  if (!findUser) {
    throw new apiError(404, "User does not exists");
  }
  const isPasswordValid = await findUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid username or password");
  }
  const { accessToken, refreshToken } = await saveAccessAndRefreshToken(
    findUser._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
});

const logout = asyncHandler(async (req, res, next) => {
  await user.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefresh = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefresh) {
    throw new apiError(401, "Unauthorized token");
  }
  const decodedRefreshToken = jwt.verify(
    incomingRefresh,
    process.env.REFRESH_TOKEN
  );

  const findUser = await user.findById(decodedRefreshToken?._id);
  if (!findUser) {
    throw new apiError(401, "Unauthorized token");
  }
  if (incomingRefresh !== user?.refreshToken) {
    throw new apiError(401, "Refresh token is expired or used");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { newrefreshToken, accessToken } = await saveAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
      new apiResponse(
        200,
        { accessToken, refreshToken: newrefreshToken },
        "Access token refreshed"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const findUser = user.findById(user?._id);
  const isPasswordSame = findUser.isPasswordCorrect(currentPassword);

  if (!isPasswordSame) {
    throw new apiError(401, "Wrong credential");
  }
  findUser.password = newPassword;
  await findUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new apiResponse(200, req.user, "User fetched successfully"));
});

const getUserChannel = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new apiError(401, "Username does not exists");
  }
  const channel = await user.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
      },
    },
  ]);
  if (!channel?.length) {
    throw new apiError(404, "Channel does not exists");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});
/* const createdUser = await user
  .findById(Saveduser._id)
  .select("-password -refreshToken"); */
module.exports = {
  register,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannel,
};
