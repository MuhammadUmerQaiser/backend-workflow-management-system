const mongoose = require("mongoose");
const gradeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("grade", gradeSchema);
