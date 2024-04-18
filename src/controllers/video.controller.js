const mongoose = require("mongoose");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.model.js");
const upload = require("../middlewares/multer.middleware.js");
const cloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  const videoFile = req.file;
  if (!videoFile) {
    throw new apiError(400, "No video file uploaded");
  }
  try {
    const uploadVideo = await cloudinary.uploader.upload(videoFile.path);
  } catch (err) {
    throw new apiError(400, "Error uploading video to cloudinary");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  const findVideo = await User.findById(videoId);
  findVideo = findVideo.videoFile;
  if (!findVideo) {
    throw new apiError(404, "No video found");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail
  const findVideo = await User.findByIdAndUpdate(
    { _id: videoId },
    {
      $set: {
        title: title,
        description: description,
      },
    },
    {
      new: true,
    }
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new apiError(404, "Video id doesnt exists");
  }
  const findVideo = await User.findByIdAndDelete({ _id: videoId });
  if (!findVideo) {
    throw new apiError(404, "No video found");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const findVideo = await User.findById({ _id: videoId });
  if (!findVideo) {
    throw new apiError(404, "No video found");
  }
  findVideo.published = !findVideo.published;
  await findVideo.save();
  res.status(200).json(apiResponse.successResponse(findVideo));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
