const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const subCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: {
      type: ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("sub-category", subCategorySchema);
