const mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task", taskSchema);
