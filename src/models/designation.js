const mongoose = require("mongoose");
const designationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);
module.exports = mongoose.model("designation", designationSchema);
