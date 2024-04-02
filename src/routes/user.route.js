const router = require("express").Router();
const register = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const loginUser = require("../controllers/user.controller.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const logout = require("../controllers/user.controller.js");
const refreshAccessToken = require("../controllers/user.controller.js");
const changeCurrentPassword = require("../controllers/user.controller.js");
const getCurrentUser = require("../controllers/user.controller.js");

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

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logout);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(getCurrentUser);

module.exports = router;
