const mongoose = require("mongoose");
const roleSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model("role", roleSchema);
