const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const taxPayerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    ntn: {
      type: Number,
      default: null,
      unique: true,
    },
    category: {
      type: ObjectId,
      ref: "category",
      required: true,
    },
    sub_category: {
      type: ObjectId,
      ref: "sub-category",
      required: true,
    },
    occupied: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("tax-payer", taxPayerSchema);
