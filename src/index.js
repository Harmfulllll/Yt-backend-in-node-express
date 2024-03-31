const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./database/db.js");

dotenv.config();
const app = express();

/* middlewares */
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

/* Setup cors */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/* Import route */
const userRoute = require("./routes/user.route.js");

/* Route declare */
app.use("/users", userRoute);
/* connect DB */

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !", err);
  });
