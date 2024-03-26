const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connect = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`);
  } catch (err) {
    console.error("Error :", err);
    throw err;
  }
};

module.exports = connect;
