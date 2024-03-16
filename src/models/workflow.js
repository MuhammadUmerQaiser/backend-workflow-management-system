const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const workflowSchema = mongoose.Schema(
  {
    task: { type: String, required: true },
    time: { type: String, default: () => new Date().getTime() },
    date: { type: Date, default: Date.now },
    meeting: {
      type: String,
      default: "No",
      enum: ["Yes", "No"],
    },
    related: {
      type: String,
      default: "Internal",
      enum: ["Internal", "External"],
    },
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("workflow", workflowSchema);
