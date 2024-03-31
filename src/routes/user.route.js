const router = require("express").Router();
const register = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register
);

module.exports = router;
