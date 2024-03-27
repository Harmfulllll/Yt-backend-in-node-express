const asyncHandler = (func) => async (req, res, next) => {
  try {
  } catch (error) {
    await func(req, res, next);
    res.status(err.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = asyncHandler;
