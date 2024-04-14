const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const workingGroupSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: [
      {
        type: ObjectId,
        ref: "category",
        required: true,
      },
    ],
    sub_category: [
      {
        type: ObjectId,
        ref: "sub-category",
        required: true,
      },
    ],
    tax_payer: [
      {
        type: ObjectId,
        ref: "tax-payer",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("working-group", workingGroupSchema);
