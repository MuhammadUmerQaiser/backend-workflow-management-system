const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const taskHistorySchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    task_assignment: {
      type: ObjectId,
      ref: "task-assignment",
      required: true,
    },
    created: { type: Date, default: Date.now },
    removed: { type: Date, default: null },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Transferred"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task-history", taskHistorySchema);
