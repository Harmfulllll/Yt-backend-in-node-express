const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./database/db.js");

dotenv.config();
const app = express();

/* connect DB */

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
