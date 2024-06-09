const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      default: null,
      // required: true,
    },
    designation: {
      type: String,
      // required: true,
      default: null,
    },
    token: {
      type: String,
      // required: true,
      default: null,
    },
    associated: {
      type: ObjectId,
      ref: "desk",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
