const mongoose = require("mongoose");
require("dotenv").config();

const MongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
  mongoose.connect(MongoURI);

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = connectToMongo;
