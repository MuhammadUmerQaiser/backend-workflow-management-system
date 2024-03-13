const mongoose = require("mongoose");
const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    member: { type: Number, default: 3 },
    membersList: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model("team", teamSchema);
