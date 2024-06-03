const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskResponseSchema = mongoose.Schema(
  {
    reciever: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    task_assignment: { type: ObjectId, ref: "task-assignment", required: true },
    sender: { type: ObjectId, ref: "user", default: null },
    response: { type: String, required: false, default: null },
    type: {
      type: String,
      enum: ["message", "transfer"],
      default: "message",
    },
    file: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task-response", taskResponseSchema);
