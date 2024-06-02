const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const deskHistorySchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    desk: {
      type: ObjectId,
      ref: "desk",
      required: true,
    },
    created: { type: Date, default: Date.now },
    removed: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("desk-history", deskHistorySchema);
