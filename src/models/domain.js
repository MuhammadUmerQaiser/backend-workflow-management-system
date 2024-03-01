const mongoose = require("mongoose");
const domainSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);
module.exports = mongoose.model("domain", domainSchema);
